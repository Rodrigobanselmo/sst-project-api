import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { StructuredToolInterface } from '@langchain/core/tools';
import type { CallbackManager } from '@langchain/core/callbacks/manager';
import type { StreamEvent } from '../types/stream-events';
import { createUserTools } from '../tools/user.tools';
import type { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import type { AiFileAttachment } from '../../database/repositories/ai-thread.repository';
import type { FileAttachment } from '../file-processing';
import { agentToolLoop } from '../llm/agent-tool-loop';

const USER_AGENT_SYSTEM_PROMPT = `Voce e um assistente especializado em gerenciamento de usuarios.
Voce ajuda a listar e consultar informacoes sobre os usuarios da empresa.

IMPORTANTE: Sempre responda no MESMO IDIOMA que o usuario esta usando. Detecte o idioma da conversa e corresponda.

Voce tem acesso a ferramentas que permitem:
- Listar usuarios da empresa
- Re-ler arquivos previamente anexados usando a ferramenta reread_file

REGRA CRÍTICA - NÃO MOSTRE IDs AO USUÁRIO:
- Os IDs dos usuários são APENAS para uso interno nas ferramentas
- NUNCA inclua IDs nas suas respostas ao usuário
- Quando listar usuários, mostre apenas: nome e email
- Use os IDs internamente se necessário, mas não os exiba no chat

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
  prebuiltHistoryMessages?: BaseMessage[];
  prebuiltCurrentMessage?: HumanMessage;
  additionalTools?: StructuredToolInterface[];
  callbacks?: CallbackManager;
}

export async function* streamUserAgent(input: UserAgentInput): AsyncGenerator<StreamEvent, void, undefined> {
  const userTools = createUserTools({
    usersRepository: input.usersRepository,
    companyId: input.companyId,
  });
  const tools = [...userTools, ...(input.additionalTools ?? [])];

  let historyMessages: BaseMessage[];
  let currentUserMessage: HumanMessage;

  if (input.prebuiltHistoryMessages && input.prebuiltCurrentMessage) {
    historyMessages = input.prebuiltHistoryMessages;
    currentUserMessage = input.prebuiltCurrentMessage;
  } else {
    historyMessages = (input.history ?? []).map((msg) => (msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)));
    currentUserMessage = new HumanMessage(input.message);
  }

  const messages = [new SystemMessage(USER_AGENT_SYSTEM_PROMPT), ...historyMessages, currentUserMessage];

  yield* agentToolLoop({ llm: input.llm, messages, tools, callbacks: input.callbacks });
}
