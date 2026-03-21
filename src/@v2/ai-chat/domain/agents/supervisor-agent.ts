import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { type AgentType, type StreamEvent } from '../types/stream-events';
import { streamUserAgent } from './user-agent';
import { streamDocumentAgent } from './document-agent';
import type { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import type { AiFileAttachment } from '../../database/repositories/ai-thread.repository';
import {
  buildHistoryMessages,
  buildCurrentUserMessage,
  type FileAttachment,
  type ExtractionResult,
} from '../file-processing';
import { createFileTools } from '../tools/file.tools';

/**
 * Agent metadata for display
 */
export const AGENT_METADATA: Record<AgentType, { name: string; description: string }> = {
  user: { name: 'User Agent', description: 'Assistente de gerenciamento de usuarios' },
  document: { name: 'Document Agent', description: 'Assistente de documentos' },
  general: { name: 'General', description: 'Assistente geral' },
};

const SUPERVISOR_SYSTEM_PROMPT = `Voce e um supervisor que classifica a intencao do usuario.
Analise a mensagem e responda APENAS com uma das seguintes categorias:
- "user" - se o usuario quer listar, buscar ou gerenciar usuarios/funcionarios/colaboradores
- "document" - se o usuario quer gerar, criar ou gerenciar documentos
- "general" - para qualquer outra pergunta ou conversa geral

Responda SOMENTE com a categoria, sem explicacao.`;

const GENERAL_SYSTEM_PROMPT = `Voce e um assistente prestativo para uma plataforma de SST (Seguranca e Saude no Trabalho).

IMPORTANTE: Sempre responda no MESMO IDIOMA que o usuario esta usando. Detecte o idioma da conversa e corresponda.

Voce pode analisar imagens e documentos enviados pelo usuario.
Se voce ver um placeholder [Previously attached ...] no historico para um arquivo,
voce pode usar a ferramenta reread_file com o fileId para re-examinar o conteudo do arquivo.
Seja claro, objetivo e amigavel nas respostas.
Formate as respostas de forma legivel.`;

export interface SupervisorInput {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string; attachments?: AiFileAttachment[] }>;
  attachments?: FileAttachment[];
  companyId: string;
  usersRepository: UsersRepository;
  llm: BaseChatModel;
  userId: number;
  /** Pre-extracted file contents from controller (avoids double S3 download) */
  extractedContents?: Map<string, ExtractionResult>;
}

/**
 * Classifies user intent using LLM
 */
async function classifyIntent(llm: BaseChatModel, message: string): Promise<AgentType> {
  const response = await llm.invoke([new SystemMessage(SUPERVISOR_SYSTEM_PROMPT), new HumanMessage(message)]);

  const content = typeof response.content === 'string' ? response.content.trim().toLowerCase() : '';

  if (content.includes('user')) return 'user';
  if (content.includes('document')) return 'document';
  return 'general';
}

/**
 * Streams the supervisor agent response.
 * Handles file processing globally before delegating to sub-agents:
 * - Builds history messages using cached extracted content (no redundant S3 downloads)
 * - Builds current user message with actual file content (using pre-extracted results)
 * - Injects reread_file tool for all sub-agents
 */
export async function* streamSupervisorAgent(input: SupervisorInput): AsyncGenerator<StreamEvent, void, undefined> {
  try {
    const agentType = await classifyIntent(input.llm, input.message);

    // Emit agent start event
    yield {
      type: 'agent_start',
      agent: agentType,
      name: AGENT_METADATA[agentType].name,
      description: AGENT_METADATA[agentType].description,
    };

    // Build pre-processed messages from history (uses cached extractions)
    const historyMessages = await buildHistoryMessages(input.history ?? []);

    // Process current message attachments
    const hasAttachments = input.attachments && input.attachments.length > 0;
    const extractedContents = input.extractedContents ?? new Map();

    // Emit loading indicators BEFORE the actual work
    if (hasAttachments) {
      for (const att of input.attachments!) {
        yield {
          type: 'tool_start' as const,
          tool: `process_file:${att.filename}`,
          args: { filename: att.filename },
          description: `Reading ${att.filename}`,
        };
      }
    }

    // Build current user message (this is where S3 downloads happen for binary files)
    const currentUserMessage = await buildCurrentUserMessage(input.message, input.attachments, extractedContents);

    // Emit completion AFTER the actual work
    if (hasAttachments) {
      for (const att of input.attachments!) {
        yield {
          type: 'tool_end' as const,
          tool: `process_file:${att.filename}`,
          result: `Processed ${att.filename}`,
          success: true,
        };
      }
    }

    // Create global file tools
    const fileTools = createFileTools(input.userId);

    if (agentType === 'user') {
      for await (const event of streamUserAgent({
        message: input.message,
        history: input.history,
        attachments: input.attachments,
        companyId: input.companyId,
        usersRepository: input.usersRepository,
        llm: input.llm,
        prebuiltHistoryMessages: historyMessages,
        prebuiltCurrentMessage: currentUserMessage,
        additionalTools: fileTools,
      })) {
        yield event;
      }
    } else if (agentType === 'document') {
      for await (const event of streamDocumentAgent({
        message: input.message,
        history: input.history,
        companyId: input.companyId,
      })) {
        yield event;
      }
    } else {
      // General - respond directly via LLM streaming with multimodal support
      // Bind file tools to the general LLM so it can re-read files
      const llmWithTools = input.llm.bindTools(fileTools);

      const messagesWithSystem = [new SystemMessage(GENERAL_SYSTEM_PROMPT), ...historyMessages, currentUserMessage];

      let currentMessages: BaseMessage[] = messagesWithSystem;
      let iterations = 0;
      const maxIterations = 10;

      while (iterations < maxIterations) {
        iterations++;
        const response = await llmWithTools.invoke(currentMessages);

        // Check if there are tool calls (e.g., reread_file)
        if ('tool_calls' in response && Array.isArray(response.tool_calls) && response.tool_calls.length > 0) {
          currentMessages = [...currentMessages, response];

          for (const toolCall of response.tool_calls) {
            const foundTool = fileTools.find((t) => t.name === toolCall.name);
            if (foundTool) {
              const args = toolCall.args as Record<string, unknown>;
              const description = (args._actionDescription as string | undefined) ?? toolCall.name;

              yield { type: 'tool_start', tool: toolCall.name, args, description };

              try {
                const toolResult = await (foundTool.invoke as (args: unknown) => Promise<string>)(toolCall.args);
                const resultStr = typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult);

                // Check for binary file result (e.g., image from reread_file)
                const { BINARY_RESULT_PREFIX } = await import('../tools/file.tools');
                if (resultStr.startsWith(BINARY_RESULT_PREFIX)) {
                  const binaryJson = resultStr.slice(BINARY_RESULT_PREFIX.length);
                  const binaryData = JSON.parse(binaryJson) as { filename: string; mimeType: string; dataUrl: string };

                  yield { type: 'tool_end', tool: toolCall.name, result: `Loaded ${binaryData.filename}`, success: true };

                  currentMessages.push({
                    role: 'tool',
                    content: `File ${binaryData.filename} loaded — see the image below.`,
                    tool_call_id: toolCall.id,
                    name: toolCall.name,
                  } as unknown as BaseMessage);

                  currentMessages.push(
                    new HumanMessage({
                      content: [
                        { type: 'text' as const, text: `[Re-read file: ${binaryData.filename}]` },
                        { type: 'image_url' as const, image_url: { url: binaryData.dataUrl, detail: 'auto' as const } },
                      ],
                    }),
                  );
                } else {
                  yield {
                    type: 'tool_end',
                    tool: toolCall.name,
                    result: resultStr,
                    success: !resultStr.toLowerCase().startsWith('failed'),
                  };

                  currentMessages.push({
                    role: 'tool',
                    content: resultStr,
                    tool_call_id: toolCall.id,
                    name: toolCall.name,
                  } as unknown as BaseMessage);
                }
              } catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                yield { type: 'tool_end', tool: toolCall.name, result: errorMsg, success: false };
              }
            }
          }
          continue;
        }

        // No tool calls - stream the final response
        const stream = await llmWithTools.stream(currentMessages);

        for await (const chunk of stream) {
          const content =
            typeof chunk.content === 'string'
              ? chunk.content
              : Array.isArray(chunk.content)
                ? chunk.content
                    .filter((c): c is { type: 'text'; text: string } => c.type === 'text')
                    .map((c) => c.text)
                    .join('')
                : '';

          if (content) {
            yield { type: 'content', content };
          }
        }
        break;
      }
    }

    yield { type: 'agent_end', agent: agentType, success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    yield { type: 'error', message: errorMessage };
  }
}
