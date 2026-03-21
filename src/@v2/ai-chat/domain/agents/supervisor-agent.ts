import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { type AgentType, type StreamEvent } from '../types/stream-events';
import { streamUserAgent } from './user-agent';
import { streamDocumentAgent } from './document-agent';
import type { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';

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

Seja claro, objetivo e amigavel nas respostas.
Formate as respostas de forma legivel.`;

export interface SupervisorInput {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  companyId: string;
  usersRepository: UsersRepository;
  llm: BaseChatModel;
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
 * Routes to the appropriate agent based on user intent classification.
 */
export async function* streamSupervisorAgent(input: SupervisorInput): AsyncGenerator<StreamEvent, void, undefined> {
  try {
    const agentType = await classifyIntent(input.llm, input.message);

    // Emit agent start event
    yield {
      type: 'agent_start',
      agent: agentType,
      description: AGENT_METADATA[agentType].description,
    };

    if (agentType === 'user') {
      // Delegate to User Agent - pass through all events
      for await (const event of streamUserAgent({
        message: input.message,
        history: input.history,
        companyId: input.companyId,
        usersRepository: input.usersRepository,
        llm: input.llm,
      })) {
        yield event;
      }
    } else if (agentType === 'document') {
      // Delegate to Document Agent - pass through all events
      for await (const event of streamDocumentAgent({
        message: input.message,
        history: input.history,
        companyId: input.companyId,
      })) {
        yield event;
      }
    } else {
      // General - respond directly via LLM streaming
      const historyMessages: BaseMessage[] = (input.history ?? []).map((msg) =>
        msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content),
      );

      const stream = await input.llm.stream([new SystemMessage(GENERAL_SYSTEM_PROMPT), ...historyMessages, new HumanMessage(input.message)]);

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
    }

    // Emit agent end event
    yield { type: 'agent_end', agent: agentType, success: true };
  } catch (error) {
    // Emit error event
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    yield { type: 'error', message: errorMessage };
  }
}
