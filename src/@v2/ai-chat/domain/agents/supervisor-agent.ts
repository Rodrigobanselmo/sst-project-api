import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { StructuredToolInterface } from '@langchain/core/tools';
import type { PrismaClient } from '@prisma/client';
import { type AgentType, type StreamEvent } from '../types/stream-events';
import { streamCharacterizationAgent } from './characterization-agent';
import type { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import type { AiFileAttachment } from '../../database/repositories/ai-thread.repository';
import { buildHistoryMessages, buildCurrentUserMessage, type FileAttachment, type ExtractionResult } from '../file-processing';
import { createFileTools } from '../tools/file.tools';
import { createNavigationTools } from '../tools/navigation.tools';
import { createCompanyTools } from '../tools/company.tools';
import { summarizeForPrompt as summarizeNavigationCatalog } from '../navigation/navigation-catalog';
import { agentToolLoop } from '../llm/agent-tool-loop';
import { RunTree } from 'langsmith';
import { createChildRun, endRun } from '../llm/tracing';
import type { CallbackManager } from '@langchain/core/callbacks/manager';

/**
 * Agent metadata for display
 */
export const AGENT_METADATA: Record<AgentType, { name: string; description: string }> = {
  user: { name: 'Agente de Usuários', description: 'Assistente de gerenciamento de usuarios' },
  document: { name: 'Agente de Documentos', description: 'Assistente de documentos' },
  characterization: { name: 'Assistente SST', description: 'Assistente de caracterização de riscos' },
  general: { name: 'Assistente Geral', description: 'Assistente geral' },
};

const SUPERVISOR_CLASSIFICATION_PROMPT = `Você é um supervisor que classifica a intenção do usuário.
Analise a mensagem (e o CONTEXTO DA PÁGINA, se houver) e responda APENAS com UMA categoria.

DIMENSÕES DE INTENÇÃO (decida qual aplica):

1. **AÇÃO DIRETA / MUTATION** — usuário usa imperativo para criar/adicionar/editar/remover/atualizar DADOS reais.
   Exemplos: "adicione risco de ruído", "edita o cargo motorista", "remove o EPI X", "atualiza a probabilidade desse risco", "cria um novo GHO Operadores".
   → Vai para o agente DONO daquele dado (characterization para riscos/cargos/grupos/ambientes; user para funcionários).
   ⚠️ NÃO confundir com "como cadastro X" (isso é pergunta INSTRUCIONAL → general).

2. **CONSULTA DE DADOS** — usuário pede para listar/mostrar/buscar/analisar dados.
   Exemplos: "liste meus riscos", "quais cargos tem", "mostra meus funcionários".
   → Vai para o agente dono do dado.

3. **INSTRUCIONAL / NAVEGAÇÃO** — usuário pergunta COMO/ONDE fazer, ou pede para abrir uma página/seção.
   Exemplos: "como cadastro um risco?", "onde edito a empresa?", "abre o plano de ação", "me leva pra hierarquia".
   → Vai para "general" (que emite card de navegação).

Categorias disponíveis:
- "characterization" — riscos (BIO, QUI, FIS, ERG, ACI, OUTROS, PSIC), grupos homogêneos (GHO), ambientes, postos, atividades, equipamentos, cargos/setores/diretorias, caracterização, EPIs/EPCs vinculados a riscos. Inclui MUTATION e CONSULTA desses dados.
- "user" — usuários/funcionários/colaboradores: CONSULTA e MUTATION.
- "document" — geração ou consulta de documentos.
- "general" — apenas perguntas INSTRUCIONAIS, NAVEGAÇÃO ou ajuda conceitual sobre o sistema.

USO DO CONTEXTO DA PÁGINA (se fornecido abaixo):
- Se o usuário está em página de caracterização/risco/GHO/cargo, prefira "characterization" para mensagens ambíguas (ex: "adiciona ruído" sem dizer onde).
- Se está em página de funcionários, prefira "user".
- O contexto NUNCA sobrepõe uma intenção CLARA de outro tipo.

EXEMPLOS DECISIVOS:
- "adicione risco de ruído e trabalho em altura" → characterization (MUTATION em riscos)
- "como adiciono um risco?" → general (instrucional)
- "abre a página de riscos" → general (navegação)
- "liste meus riscos biológicos" → characterization (consulta)
- "edita o cargo de motorista para incluir EPI luva" → characterization (mutation em cargo/EPI)
- "cadastre o funcionário João Silva" → user (mutation em funcionário)
- "como cadastro um funcionário?" → general (instrucional)
- "quais funcionários eu tenho?" → user (consulta)
- "onde edito os dados da empresa?" → general (instrucional)

Responda SOMENTE com a categoria (uma palavra), sem explicação.`;

const SUPERVISOR_ORCHESTRATION_PROMPT = `Você é um assistente geral de um sistema de SST (Segurança e Saúde no Trabalho).

IMPORTANTE: Sempre responda no MESMO IDIOMA que o usuário está usando.

Você é especialista em ajudar o usuário a NAVEGAR pelo sistema e ENTENDER como executar tarefas.

REGRA PRINCIPAL — CARDS DE NAVEGAÇÃO:
Sempre que o usuário fizer uma pergunta INSTRUCIONAL ("como faço para...", "onde fica...", "onde edito...", "como cadastro...") OU pedir explicitamente para abrir/navegar até alguma parte do sistema ("abre X", "me leva para Y", "quero editar/cadastrar Z"):
1. Escreva NO MÁXIMO UMA frase curta antes da tool (ex: "Vou te levar para a página de funcionários.").
2. CHAME a ferramenta "propor_navegacao" UMA ÚNICA VEZ com a chave mais adequada.
3. NÃO escreva mais nada depois da tool. NÃO repita a explicação. NÃO chame propor_navegacao novamente. O card já é a resposta visível.
4. NUNCA invente URLs em texto puro.

RESOLUÇÃO DE EMPRESA (companyId):
Se o destino exige companyId e o usuário mencionou uma empresa pelo NOME (ex: "macdonalds", "padaria do joão", "minha clínica") em vez de já estar no contexto da página:
1. PRIMEIRO chame "buscar_empresas_acessiveis" com searchTerm = o nome dito (mesmo com erro de grafia — a busca é fuzzy).
2. Se houver 1 match claro (score alto / único resultado próximo), use o "id" retornado direto em propor_navegacao.params.companyId.
3. Se houver MÚLTIPLOS resultados próximos, liste-os em UMA frase curta e pergunte qual é a empresa correta — NÃO chame propor_navegacao ainda.
4. Se NÃO houver nenhum resultado, avise o usuário e peça outro identificador (CNPJ, nome fantasia).
NUNCA peça o CNPJ direto sem antes tentar a busca por nome.
Se o usuário NÃO mencionou empresa nenhuma e o pageContext já tem companyId, use o pageContext (preenchido automaticamente) — não chame buscar_empresas_acessiveis à toa.

Todos os destinos são PÁGINAS (rotas) do sistema — não há modais. A página de destino sempre tem os botões/formulários para a ação que o usuário quer realizar.

DESAMBIGUAÇÃO — DOCUMENTOS:
Existem DUAS rotas distintas para documentos. Antes de propor um card de "documentos", entenda qual o usuário quer:
1. **DOCUMENTS_GENERATE** ("Gerar novo documento") — sistema GERA um documento (PGR, LTCAT, PCMSO, Insalubridade, Periculosidade) a partir dos dados de SST. Use para "gerar/criar/emitir/produzir laudo".
2. **DOCUMENTS_STORAGE** ("Documentos salvos") — usuário SOBE um arquivo que já tem e controla VENCIMENTO. Use para "salvar/subir/guardar/arquivar documento" ou "gerenciar vencimento".

Se o usuário pedir só "documentos" / "abrir documentos" sem especificar, PERGUNTE em UMA frase: "Você quer **gerar um novo documento** (PGR, LTCAT, PCMSO, etc.) ou **salvar um documento** que já tem com controle de vencimento?" — e NÃO chame propor_navegacao ainda. Espere a resposta.

A mesma lógica vale para outros casos ambíguos: se a intenção não estiver clara, pergunte primeiro, depois proponha o card.

DESTINOS DISPONÍVEIS NO CATÁLOGO DE NAVEGAÇÃO:
{{NAVIGATION_CATALOG}}

Para outras perguntas (ajuda geral, dúvidas conceituais sobre SST, etc.), responda diretamente em texto.

Seja claro, objetivo e útil.`;

export interface PageContext {
  companyId?: string;
  homogeneousGroupId?: string;
  hierarchyId?: string;
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
  /** Dedicated fast LLM for intent classification (always fast regardless of user mode) */
  fastLlm?: BaseChatModel;
  /** Smarter LLM for tools that require more reasoning */
  smarterLlm?: BaseChatModel;
  /** Pre-extracted file contents from controller (avoids double S3 download) */
  extractedContents?: Map<string, ExtractionResult>;
  /** Page context from frontend (URL params, current page info) */
  pageContext?: PageContext;
  /** Thread ID for context */
  threadId?: string;
  /** Assistant message ID (created before agent loop for tool linking) */
  assistantMessageId?: string;
}

/**
 * Builds context-aware system prompt with page context
 */
function buildContextAwarePrompt(basePrompt: string, pageContext?: PageContext): string {
  if (!pageContext) return basePrompt;

  const contextParts: string[] = [];

  // Company context
  if (pageContext.companyId) {
    contextParts.push(`- Empresa sendo visualizada: ID ${pageContext.companyId}`);
  }

  // Implied page (helps classifier bias toward the right agent)
  if (pageContext.homogeneousGroupId || pageContext.hierarchyId) {
    contextParts.push(`- O usuário está em uma PÁGINA DE CARACTERIZAÇÃO (riscos / GHO / cargos). Para mensagens ambíguas envolvendo riscos/EPIs/cargos/grupos, prefira o agente "characterization".`);
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
async function classifyIntent(llm: BaseChatModel, message: string, history: BaseMessage[], callbacks: CallbackManager, pageContext?: PageContext): Promise<AgentType> {
  const systemPrompt = buildContextAwarePrompt(SUPERVISOR_CLASSIFICATION_PROMPT, pageContext);
  const response = await llm.invoke([new SystemMessage(systemPrompt), ...history, new HumanMessage(message)], { callbacks });

  const content = typeof response.content === 'string' ? response.content.trim().toLowerCase() : '';

  if (content.includes('general')) return 'general';
  // Default to characterization — it has the broadest toolset for SST queries
  return 'characterization';
}

/**
 * Streams general supervisor responses for system-level questions (instructional
 * "how do I..." / navigation requests). Uses agentToolLoop so it can call
 * `propor_navegacao` to emit navigation cards.
 */
async function* streamGeneralSupervisor(input: {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  llm: BaseChatModel;
  tools: StructuredToolInterface[];
  prebuiltHistoryMessages?: BaseMessage[];
  prebuiltCurrentMessage?: HumanMessage;
  callbacks?: CallbackManager;
}): AsyncGenerator<StreamEvent, void, undefined> {
  let historyMessages: BaseMessage[];
  let currentUserMessage: HumanMessage;

  if (input.prebuiltHistoryMessages && input.prebuiltCurrentMessage) {
    historyMessages = input.prebuiltHistoryMessages;
    currentUserMessage = input.prebuiltCurrentMessage;
  } else {
    historyMessages = (input.history ?? []).map((msg) => (msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)));
    currentUserMessage = new HumanMessage(input.message);
  }

  const systemPromptWithCatalog = SUPERVISOR_ORCHESTRATION_PROMPT.replace('{{NAVIGATION_CATALOG}}', summarizeNavigationCatalog());

  const messages = [new SystemMessage(systemPromptWithCatalog), ...historyMessages, currentUserMessage];

  yield* agentToolLoop({
    llm: input.llm,
    messages,
    tools: input.tools,
    callbacks: input.callbacks,
  });
}

/**
 * Streams the supervisor agent response.
 * Handles file processing globally before delegating to sub-agents.
 */
export async function* streamSupervisorAgent(input: SupervisorInput): AsyncGenerator<StreamEvent, void, undefined> {
  // Create a parent run for LangSmith to group all traces
  // IMPORTANT: Use pageContext.companyId (from frontend URL/view) as the primary source
  // Fall back to user's company only if pageContext is not available
  const companyId = input.pageContext?.companyId ?? input.user.targetCompanyId ?? input.user.companyId;

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
    // Classification quality matters a lot (wrong agent = wrong tools = useless reply).
    // Use the smarter LLM if available, falling back to fast then default.
    const classifierLlm = input.smarterLlm ?? input.fastLlm ?? input.llm;
    const agentType = await classifyIntent(classifierLlm, input.message, recentHistory, classifyCallbacks, input.pageContext);
    await endRun(classifyRun, { outputs: { agentType } });

    // Emit agent start event (frontend will show loading automatically)
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
        contextParts.push(`- Empresa (companyId): ${input.pageContext.companyId}`);
      }

      // Homogeneous group context
      if (input.pageContext.homogeneousGroupId) {
        contextParts.push(`- Grupo homogêneo (groupId): ${input.pageContext.homogeneousGroupId}`);
        contextParts.push(`IMPORTANTE: Quando o usuário se referir a "este grupo", "esse grupo", ou "o grupo que estou vendo", use EXATAMENTE este groupId: ${input.pageContext.homogeneousGroupId}`);
      }

      // Hierarchy context
      if (input.pageContext.hierarchyId) {
        contextParts.push(`- Hierarquia (hierarchyId): ${input.pageContext.hierarchyId}`);
        contextParts.push(`IMPORTANTE: Quando o usuário se referir a "este cargo", "esse cargo", ou "o cargo que estou vendo", use EXATAMENTE este hierarchyId: ${input.pageContext.hierarchyId}`);
      }

      if (contextParts.length > 0) {
        userMessageText = `[CONTEXTO DA PÁGINA ATUAL]\n${contextParts.join('\n')}\n\n[MENSAGEM DO USUÁRIO]\n${input.message}`;
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

    // Create global file/navigation/company tools (available to all agents)
    const fileTools = createFileTools(input.prisma, input.user.userId);
    const navigationTools = createNavigationTools({ pageContext: input.pageContext });
    const companyTools = createCompanyTools({
      prisma: input.prisma,
      userId: input.user.userId,
      defaultCompanyId: companyId,
    });
    const sharedTools: StructuredToolInterface[] = [...fileTools, ...navigationTools, ...companyTools];

    // Create child run for the delegated agent
    const agentName = AGENT_METADATA[agentType].name;
    const { childRun: agentRun, callbacks: agentCallbacks } = await createChildRun(parentRun, agentName, {
      tags: ['agent', agentType],
      inputs: { message: input.message.substring(0, 200), agentType },
    });

    // Track if sub-agent generated any content
    let subAgentGeneratedContent = false;
    let subAgentResponse = '';
    let toolCallCount = 0;

    try {
      if (agentType === 'general') {
        // General agent: supervisor handles directly with orchestration prompt + navigation tools
        for await (const event of streamGeneralSupervisor({
          message: input.message,
          history: input.history,
          llm: input.llm,
          tools: sharedTools,
          prebuiltHistoryMessages: historyMessages,
          prebuiltCurrentMessage: currentUserMessage,
          callbacks: agentCallbacks,
        })) {
          if (event.type === 'content') {
            subAgentGeneratedContent = true;
            subAgentResponse += event.content;
          }
          if (event.type === 'tool_end') toolCallCount++;
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
          smarterLlm: input.smarterLlm,
          prebuiltHistoryMessages: historyMessages,
          prebuiltCurrentMessage: currentUserMessage,
          additionalTools: sharedTools,
          callbacks: agentCallbacks,
          userId: input.user.userId,
          assistantMessageId: input.assistantMessageId,
        })) {
          if (event.type === 'content') {
            subAgentGeneratedContent = true;
            subAgentResponse += event.content;
          }
          if (event.type === 'tool_end') toolCallCount++;
          yield event;
        }
      }

      // If sub-agent called tools but didn't generate any content response, notify user
      if (!subAgentGeneratedContent && toolCallCount > 0) {
        console.warn(`[Supervisor] Sub-agent ${agentType} called ${toolCallCount} tools but generated no content`);
        yield {
          type: 'content',
          content: `⚠️ Foram executadas ${toolCallCount} operações, mas nenhuma resposta foi gerada. Isso pode indicar um problema. Tente reformular sua pergunta ou recarregue a página para ver se as informações foram salvas.`,
        };
      }

      await endRun(agentRun, { outputs: { success: true, contentGenerated: subAgentGeneratedContent, toolCalls: toolCallCount, responseLength: subAgentResponse.length } });
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
