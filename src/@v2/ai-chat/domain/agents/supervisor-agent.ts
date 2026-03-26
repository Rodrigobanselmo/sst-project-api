import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { PrismaClient } from '@prisma/client';
import { type AgentType, type StreamEvent } from '../types/stream-events';
import { streamUserAgent } from './user-agent';
import { streamDocumentAgent } from './document-agent';
import { streamCharacterizationAgent } from './characterization-agent';
import type { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import type { AiFileAttachment } from '../../database/repositories/ai-thread.repository';
import { buildHistoryMessages, buildCurrentUserMessage, type FileAttachment, type ExtractionResult } from '../file-processing';
import { createFileTools } from '../tools/file.tools';
import { RunTree } from 'langsmith';
import { createChildRun, endRun } from '../llm/tracing';
import type { CallbackManager } from '@langchain/core/callbacks/manager';

/**
 * Agent metadata for display
 */
export const AGENT_METADATA: Record<AgentType, { name: string; description: string }> = {
  user: { name: 'Agente de Usuários', description: 'Assistente de gerenciamento de usuarios' },
  document: { name: 'Agente de Documentos', description: 'Assistente de documentos' },
  characterization: { name: 'Agente de Caracterização', description: 'Assistente de caracterização de riscos' },
  general: { name: 'Agente Geral', description: 'Assistente geral' },
};

const SUPERVISOR_SYSTEM_PROMPT = `Voce e um supervisor que classifica a intencao do usuario.
Analise a mensagem e responda APENAS com uma das seguintes categorias:
- "user" - se o usuario quer listar, buscar ou gerenciar usuarios/funcionarios/colaboradores
- "document" - se o usuario quer gerar, criar ou gerenciar documentos
- "characterization" - se o usuario quer consultar, listar ou analisar riscos/fatores de risco (BIO, QUI, FIS, ERG, ACI, OUTROS), ambientes de trabalho, postos de trabalho, cargos, setores, grupos homogêneos, caracterização, ou perigos ocupacionais. Na duvida entre characterization e outra categoria, prefira characterization.

Responda SOMENTE com a categoria, sem explicacao.`;


export interface PageContext {
  companyId?: string;
  homogeneousGroupId?: string;
}

export interface SupervisorUser {
  userId: number;
  companyId: string;
  targetCompanyId?: string;
  email: string;
  isMaster: boolean;
}

export interface SupervisorInput {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string; attachments?: AiFileAttachment[] }>;
  attachments?: FileAttachment[];
  user: SupervisorUser;
  usersRepository: UsersRepository;
  prisma: PrismaClient;
  llm: BaseChatModel;
  /** Pre-extracted file contents from controller (avoids double S3 download) */
  extractedContents?: Map<string, ExtractionResult>;
  /** Page context from frontend (URL params, current page info) */
  pageContext?: PageContext;
}

/**
 * Builds context-aware system prompt with page context
 */
function buildContextAwarePrompt(basePrompt: string, pageContext?: PageContext, userCompanyId?: string): string {
  if (!pageContext) return basePrompt;

  const contextParts: string[] = [];

  // Company context
  if (pageContext.companyId) {
    contextParts.push(`- Empresa sendo visualizada: ID ${pageContext.companyId}`);
  }

  // Homogeneous group context
  if (pageContext.homogeneousGroupId) {
    contextParts.push(`- Grupo homogêneo sendo visualizado: ID ${pageContext.homogeneousGroupId}`);
    contextParts.push(`- Quando o usuário se referir a "este grupo", "esse grupo", "o grupo que estou vendo", "grupo similar de exposição", use este ID: ${pageContext.homogeneousGroupId}`);
  }

  if (contextParts.length === 0) return basePrompt;

  return `${basePrompt}

CONTEXTO DA PÁGINA ATUAL:
${contextParts.join('\n')}`;
}

/**
 * Classifies user intent using LLM
 */
async function classifyIntent(llm: BaseChatModel, message: string, history: BaseMessage[], callbacks: CallbackManager, pageContext?: PageContext, userCompanyId?: string): Promise<AgentType> {
  const systemPrompt = buildContextAwarePrompt(SUPERVISOR_SYSTEM_PROMPT, pageContext, userCompanyId);
  const response = await llm.invoke([new SystemMessage(systemPrompt), ...history, new HumanMessage(message)], { callbacks });

  const content = typeof response.content === 'string' ? response.content.trim().toLowerCase() : '';

  if (content.includes('user')) return 'user';
  if (content.includes('document')) return 'document';
  // Default to characterization — it has the broadest toolset for SST queries
  return 'characterization';
}

/**
 * Streams the supervisor agent response.
 * Handles file processing globally before delegating to sub-agents.
 */
export async function* streamSupervisorAgent(input: SupervisorInput): AsyncGenerator<StreamEvent, void, undefined> {
  // Create a parent run for LangSmith to group all traces
  const companyId = input.user.targetCompanyId ?? input.user.companyId;

  const parentRun = new RunTree({
    name: 'SupervisorAgent',
    run_type: 'chain',
    inputs: {
      message: input.message.substring(0, 200),
      userId: input.user.userId,
      companyId,
    },
    tags: ['supervisor', 'main'],
  });

  await parentRun.postRun();

  try {
    // Create child run for intent classification
    const { childRun: classifyRun, callbacks: classifyCallbacks } = await createChildRun(parentRun, 'ClassifyIntent', {
      tags: ['supervisor', 'classification'],
      inputs: { message: input.message.substring(0, 200) },
    });

    // Build history early so classifyIntent has conversation context
    const historyMessages = await buildHistoryMessages(input.history ?? []);

    // Only send last few messages for classification — enough for context, avoids sending the full history
    const recentHistory = historyMessages.slice(-6);
    const agentType = await classifyIntent(input.llm, input.message, recentHistory, classifyCallbacks, input.pageContext, companyId);
    await endRun(classifyRun, { outputs: { agentType } });

    // Emit agent start event
    yield {
      type: 'agent_start',
      agent: agentType,
      name: AGENT_METADATA[agentType].name,
      description: AGENT_METADATA[agentType].description,
    };

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
    let userMessageText = input.message;

    // Inject page context into user message if available
    if (input.pageContext) {
      const contextParts: string[] = [];

      // Company context
      if (input.pageContext.companyId) {
        contextParts.push(`Empresa sendo visualizada: ID ${input.pageContext.companyId}`);
      }

      // Homogeneous group context
      if (input.pageContext.homogeneousGroupId) {
        contextParts.push(`Grupo homogêneo sendo visualizado: ID ${input.pageContext.homogeneousGroupId}`);
      }

      if (contextParts.length > 0) {
        userMessageText = `[CONTEXTO DA PÁGINA]\n${contextParts.join('\n')}\n\n${input.message}`;
      }
    }

    const currentUserMessage = await buildCurrentUserMessage(userMessageText, input.attachments, extractedContents);

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
    const fileTools = createFileTools(input.prisma, input.user.userId);

    // Create child run for the delegated agent
    const agentName = AGENT_METADATA[agentType].name;
    const { childRun: agentRun, callbacks: agentCallbacks } = await createChildRun(parentRun, agentName, {
      tags: ['agent', agentType],
      inputs: { message: input.message.substring(0, 200), agentType },
    });

    try {
      if (agentType === 'user') {
        for await (const event of streamUserAgent({
          message: input.message,
          history: input.history,
          attachments: input.attachments,
          companyId,
          usersRepository: input.usersRepository,
          llm: input.llm,
          prebuiltHistoryMessages: historyMessages,
          prebuiltCurrentMessage: currentUserMessage,
          additionalTools: fileTools,
          callbacks: agentCallbacks,
        })) {
          yield event;
        }
      } else if (agentType === 'document') {
        for await (const event of streamDocumentAgent({
          message: input.message,
          history: input.history,
          companyId,
        })) {
          yield event;
        }
      } else if (agentType === 'characterization') {
        for await (const event of streamCharacterizationAgent({
          message: input.message,
          history: input.history,
          attachments: input.attachments,
          companyId,
          prisma: input.prisma,
          llm: input.llm,
          prebuiltHistoryMessages: historyMessages,
          prebuiltCurrentMessage: currentUserMessage,
          additionalTools: fileTools,
          callbacks: agentCallbacks,
        })) {
          yield event;
        }
      }

      await endRun(agentRun, { outputs: { success: true } });
    } catch (agentError) {
      await endRun(agentRun, { error: agentError instanceof Error ? agentError.message : 'Unknown error' });
      throw agentError;
    }

    yield { type: 'agent_end', agent: agentType, success: true };

    // End the parent run successfully
    await parentRun.end({ success: true });
    await parentRun.patchRun();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    yield { type: 'error', message: errorMessage };

    // End the parent run with error
    await parentRun.end({ error: errorMessage });
    await parentRun.patchRun();
  }
}
