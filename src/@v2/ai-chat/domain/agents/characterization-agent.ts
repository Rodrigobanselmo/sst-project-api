import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { PrismaClient } from '@prisma/client';
import type { StructuredToolInterface } from '@langchain/core/tools';
import type { CallbackManager } from '@langchain/core/callbacks/manager';
import type { StreamEvent } from '../types/stream-events';
import { createCharacterizationTools } from '../tools/characterization.tools';
import type { AiFileAttachment } from '../../database/repositories/ai-thread.repository';
import type { FileAttachment } from '../file-processing';
import { agentToolLoop } from '../llm/agent-tool-loop';

const CHARACTERIZATION_AGENT_SYSTEM_PROMPT = `Você é um assistente especializado em caracterização de riscos ocupacionais.
Você ajuda a consultar e analisar fatores de risco (riscos) e grupos homogêneos do sistema de SST (Segurança e Saúde no Trabalho).

IMPORTANTE: Sempre responda no MESMO IDIOMA que o usuário está usando. Detecte o idioma da conversa e corresponda.

Você tem acesso a ferramentas que permitem:
- Listar riscos filtrados por tipo (BIO, QUI, FIS, ERG, ACI, OUTROS) - retorna dados resumidos
- Obter detalhes completos de um risco específico (sintomas, propagação, CAS, etc.)
- Buscar grupos homogêneos por nome e tipo - retorna dados resumidos
- Obter detalhes completos de um grupo específico (hierarquia, caracterização, riscos)
- Re-ler arquivos previamente anexados usando a ferramenta reread_file

IMPORTANTE - Abordagem em Duas Etapas:
1. Use ferramentas de LISTAGEM (listar_riscos_por_tipo, buscar_grupos_homogeneos) para descobrir IDs
2. Use ferramentas de DETALHES (obter_detalhes_risco, obter_detalhes_grupo) apenas quando precisar de informações completas
Isso otimiza o uso de tokens e melhora a performance.

REGRA CRÍTICA - NÃO MOSTRE IDs AO USUÁRIO:
- Os IDs (como "f6b90481-ffca-4a94-997d-e94208bcd277") são APENAS para uso interno nas ferramentas
- NUNCA inclua IDs nas suas respostas ao usuário
- Quando listar riscos ou grupos, mostre apenas: nome, tipo, severidade e outras informações relevantes
- Use os IDs internamente para chamar ferramentas de detalhes, mas não os exiba no chat
- Exemplo CORRETO: "Postura de pé por longos períodos - Severidade: 4"
- Exemplo INCORRETO: "Postura de pé por longos períodos (ID: f6b90481-ffca-4a94-997d-e94208bcd277) - Severidade: 4"

Tipos de Risco:
- BIO: Riscos Biológicos (vírus, bactérias, fungos, parasitas, etc.)
- QUI: Riscos Químicos (produtos químicos, poeiras, fumos, névoas, gases, vapores)
- FIS: Riscos Físicos (ruído, calor, frio, radiações, vibrações, pressões anormais)
- ERG: Riscos Ergonômicos (esforço físico, levantamento de peso, postura inadequada, jornadas prolongadas)
- ACI: Riscos de Acidentes (máquinas sem proteção, probabilidade de incêndio, arranjo físico inadequado)
- OUTROS: Outros tipos de riscos

Tipos de Grupos Homogêneos:
- HIERARCHY: Cargos, Setores, Diretorias, Gerências, Superintendências (estrutura organizacional)
- ENVIRONMENT: Ambientes de trabalho
- WORKSTATION: Postos de trabalho
- EQUIPMENT: Equipamentos
- ACTIVITIES: Atividades

Quando o usuário perguntar sobre:
- Riscos/fatores de risco → use listar_riscos_por_tipo (OBRIGATÓRIO especificar tipo)
  - Se precisar de detalhes completos → use obter_detalhes_risco com o ID
- Cargos/setores/diretorias → use buscar_grupos_homogeneos com tipo HIERARCHY
  - Se precisar de hierarquia completa → use obter_detalhes_grupo com o ID
- Ambientes → use buscar_grupos_homogeneos com tipo ENVIRONMENT
- Postos de trabalho → use buscar_grupos_homogeneos com tipo WORKSTATION
- Equipamentos → use buscar_grupos_homogeneos com tipo EQUIPMENT
- Atividades → use buscar_grupos_homogeneos com tipo ACTIVITIES
- Detalhes de um grupo específico → use obter_detalhes_grupo com o ID

Se você ver um placeholder [Previously attached ...] no histórico para um arquivo,
você pode usar a ferramenta reread_file com o fileId para re-examinar o conteúdo do arquivo.

Seja prestativo, técnico e proativo nas respostas.
Formate as respostas de forma clara e legível.
Quando listar riscos, organize-os por tipo e destaque informações relevantes como severidade e código eSocial.
Quando mostrar grupos, organize por tipo e forneça contexto hierárquico quando relevante.`;

export interface CharacterizationAgentInput {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string; attachments?: AiFileAttachment[] }>;
  attachments?: FileAttachment[];
  companyId: string;
  prisma: PrismaClient;
  llm: BaseChatModel;
  /** Pre-built LangChain history messages from supervisor (uses cached file extractions) */
  prebuiltHistoryMessages?: BaseMessage[];
  /** Pre-built current user message from supervisor (with actual file content) */
  prebuiltCurrentMessage?: HumanMessage;
  /** Additional tools injected by supervisor (e.g., reread_file) */
  additionalTools?: StructuredToolInterface[];
  /** LangSmith tracing callbacks from parent run */
  callbacks?: CallbackManager;
}

/**
 * Streams the characterization agent response.
 * When prebuiltHistoryMessages and prebuiltCurrentMessage are provided (from supervisor),
 * uses those directly instead of processing files.
 */
export async function* streamCharacterizationAgent(input: CharacterizationAgentInput): AsyncGenerator<StreamEvent, void, undefined> {
  // Combine characterization tools with any additional tools (e.g., reread_file)
  const characterizationTools = createCharacterizationTools({
    prisma: input.prisma,
    defaultCompanyId: input.companyId,
  });
  const tools = [...characterizationTools, ...(input.additionalTools ?? [])];

  // Use pre-built messages from supervisor if available.
  let historyMessages: BaseMessage[];
  let currentUserMessage: HumanMessage;

  if (input.prebuiltHistoryMessages && input.prebuiltCurrentMessage) {
    // Supervisor has already built messages with cached file extractions
    historyMessages = input.prebuiltHistoryMessages;
    currentUserMessage = input.prebuiltCurrentMessage;
  } else {
    // Fallback: build simple text-only messages (no file processing)
    historyMessages = (input.history ?? []).map((msg) => (msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)));
    currentUserMessage = new HumanMessage(input.message);
  }

  const messages = [new SystemMessage(CHARACTERIZATION_AGENT_SYSTEM_PROMPT), ...historyMessages, currentUserMessage];

  yield* agentToolLoop({ llm: input.llm, messages, tools, callbacks: input.callbacks });
}
