import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { StructuredToolInterface } from '@langchain/core/tools';
import type { StreamEvent } from '../types/stream-events';
import { createUserTools } from '../tools/user.tools';
import type { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import type { AiFileAttachment } from '../../database/repositories/ai-thread.repository';
import type { FileAttachment } from '../file-processing';
import { BINARY_RESULT_PREFIX } from '../tools/file.tools';

const USER_AGENT_SYSTEM_PROMPT = `Voce e um assistente especializado em gerenciamento de usuarios.
Voce ajuda a listar e consultar informacoes sobre os usuarios da empresa.

IMPORTANTE: Sempre responda no MESMO IDIOMA que o usuario esta usando. Detecte o idioma da conversa e corresponda.

Voce tem acesso a ferramentas que permitem:
- Listar usuarios da empresa
- Re-ler arquivos previamente anexados usando a ferramenta reread_file

Quando o usuario perguntar sobre usuarios, funcionarios ou colaboradores, use as ferramentas apropriadas.
Se voce ver um placeholder [Previously attached ...] no historico para um arquivo,
voce pode usar a ferramenta reread_file com o fileId para re-examinar o conteudo do arquivo.
Seja prestativo, amigavel e proativo nas respostas.
Sempre confirme antes de deletar qualquer coisa.
Formate as respostas de forma clara e legivel.`;

export interface UserAgentInput {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string; attachments?: AiFileAttachment[] }>;
  attachments?: FileAttachment[];
  companyId: string;
  usersRepository: UsersRepository;
  llm: BaseChatModel;
  /** Pre-built LangChain history messages from supervisor (uses cached file extractions) */
  prebuiltHistoryMessages?: BaseMessage[];
  /** Pre-built current user message from supervisor (with actual file content) */
  prebuiltCurrentMessage?: HumanMessage;
  /** Additional tools injected by supervisor (e.g., reread_file) */
  additionalTools?: StructuredToolInterface[];
}

/**
 * Streams the user agent response.
 * When prebuiltHistoryMessages and prebuiltCurrentMessage are provided (from supervisor),
 * uses those directly instead of processing files.
 */
export async function* streamUserAgent(input: UserAgentInput): AsyncGenerator<StreamEvent, void, undefined> {
  // Combine user tools with any additional tools (e.g., reread_file)
  const userTools = createUserTools({
    usersRepository: input.usersRepository,
    companyId: input.companyId,
  });
  const tools = [...userTools, ...(input.additionalTools ?? [])];

  const llm = input.llm.bindTools(tools);

  // Use pre-built messages from supervisor if available
  let historyMessages: BaseMessage[];
  let currentUserMessage: HumanMessage;

  if (input.prebuiltHistoryMessages && input.prebuiltCurrentMessage) {
    // Supervisor has already built messages with cached file extractions
    historyMessages = input.prebuiltHistoryMessages;
    currentUserMessage = input.prebuiltCurrentMessage;
  } else {
    // Fallback: build simple text-only messages (no file processing)
    historyMessages = (input.history ?? []).map((msg) =>
      msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content),
    );
    currentUserMessage = new HumanMessage(input.message);
  }

  const messagesWithSystem = [new SystemMessage(USER_AGENT_SYSTEM_PROMPT), ...historyMessages, currentUserMessage];

  let currentMessages: BaseMessage[] = messagesWithSystem;
  let iterations = 0;
  const maxIterations = 300; // Prevent infinite loops

  while (iterations < maxIterations) {
    iterations++;
    const response = await llm.invoke(currentMessages);

    // Check if there are tool calls
    if ('tool_calls' in response && Array.isArray(response.tool_calls) && response.tool_calls.length > 0) {
      // Execute tools
      currentMessages = [...currentMessages, response];

      for (const toolCall of response.tool_calls) {
        const foundTool = tools.find((t) => t.name === toolCall.name);
        if (foundTool) {
          const args = toolCall.args as Record<string, unknown>;
          // Extract _actionDescription from args (LLM-generated, contextual, multi-language)
          const description = (args._actionDescription as string | undefined) ?? toolCall.name;

          // Emit tool start event with LLM-generated description
          yield { type: 'tool_start', tool: toolCall.name, args, description };

          try {
            const toolResult = await (foundTool.invoke as (args: unknown) => Promise<string>)(toolCall.args);
            const resultStr = typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult);

            // Check if the tool returned a binary file (e.g., image from reread_file)
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

              // Inject the image as a proper HumanMessage so the LLM can see it
              currentMessages.push(
                new HumanMessage({
                  content: [
                    { type: 'text' as const, text: `[Re-read file: ${binaryData.filename}]` },
                    { type: 'image_url' as const, image_url: { url: binaryData.dataUrl, detail: 'auto' as const } },
                  ],
                }),
              );
            } else {
              // Normal tool result
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
            yield { type: 'error', message: errorMsg };
          }
        }
      }
      // Continue loop to get final response
      continue;
    }

    // No tool calls - stream the final response
    const stream = await llm.stream(currentMessages);

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
