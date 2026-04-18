import { tool, type StructuredToolInterface } from '@langchain/core/tools';
import { z } from 'zod';
import { findDestination, NAVIGATION_CATALOG } from '../navigation/navigation-catalog';
import type { PageContext } from '../agents/supervisor-agent';

export interface NavigationToolsDeps {
  pageContext?: PageContext;
}

export function createNavigationTools(deps: NavigationToolsDeps): StructuredToolInterface[] {
  const { pageContext } = deps;

  const validKeys = NAVIGATION_CATALOG.map((d) => d.key);
  // Per-request dedupe: same destination should never emit two cards in the
  // same turn (defense against LLM calling the tool repeatedly).
  const alreadyProposed = new Set<string>();

  const proposeNavigationTool = tool(
    async ({
      destinationKey,
      params,
    }: {
      _actionDescription: string;
      destinationKey: string;
      params?: { companyId?: string; workspaceId?: string; hierarchyId?: string; homogeneousGroupId?: string };
    }) => {
      const destination = findDestination(destinationKey);

      if (!destination) {
        return JSON.stringify({
          erro: 'Destino desconhecido',
          mensagem: `A chave "${destinationKey}" não está no catálogo de navegação. Chaves válidas: ${validKeys.join(', ')}.`,
        });
      }

      if (alreadyProposed.has(destinationKey)) {
        return JSON.stringify({
          aviso: 'Card já emitido neste turno',
          mensagem: `O card para "${destination.label}" já foi emitido. NÃO chame propor_navegacao novamente. Encerre sua resposta sem texto adicional.`,
        });
      }
      alreadyProposed.add(destinationKey);

      const resolvedParams: Record<string, string> = {};
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (typeof v === 'string' && v.length > 0) resolvedParams[k] = v;
        }
      }

      if (pageContext?.companyId && !resolvedParams.companyId) {
        resolvedParams.companyId = pageContext.companyId;
      }
      if (pageContext?.homogeneousGroupId && !resolvedParams.homogeneousGroupId) {
        resolvedParams.homogeneousGroupId = pageContext.homogeneousGroupId;
      }
      if (pageContext?.hierarchyId && !resolvedParams.hierarchyId) {
        resolvedParams.hierarchyId = pageContext.hierarchyId;
      }

      const missing = destination.requiredParams.filter((p) => !resolvedParams[p]);
      if (missing.length > 0) {
        return JSON.stringify({
          erro: 'Parâmetros obrigatórios ausentes',
          mensagem: `Para abrir "${destination.label}" preciso de: ${missing.join(', ')}. Peça esses dados ao usuário antes de propor a navegação.`,
        });
      }

      return JSON.stringify({
        _navigation_type: 'link',
        _navigation_kind: destination.kind,
        _navigation_target: destination.target,
        _navigation_label: destination.label,
        _navigation_description: destination.description,
        _navigation_params: resolvedParams,
        mensagem: `Card de navegação para "${destination.label}" já foi emitido ao usuário. NÃO repita a explicação. NÃO chame propor_navegacao novamente neste turno. Encerre sua resposta silenciosamente.`,
      });
    },
    {
      name: 'propor_navegacao',
      description:
        'Use esta ferramenta quando o usuário fizer uma pergunta instrucional ("como faço para...", "onde está...", "onde edito...") OU pedir explicitamente para abrir/navegar até alguma parte do sistema. ' +
        'Ela emite um CARD CLICÁVEL na conversa que leva o usuário direto para a página ou modal correspondente. ' +
        'NÃO use para responder consultas de dados (ex: "liste meus riscos") — para isso, use as ferramentas de consulta. ' +
        'NUNCA invente URLs em texto puro: a tool é a forma oficial de direcionar o usuário.',
      schema: z.object({
        _actionDescription: z
          .string()
          .describe('Breve descrição em PORTUGUÊS do que você está propondo (ex: "Sugerindo abrir página de funcionários").'),
        destinationKey: z
          .enum(validKeys as [string, ...string[]])
          .describe('Chave do destino no catálogo de navegação. Escolha a que melhor casa com a intenção do usuário.'),
        params: z
          .object({
            companyId: z.string().optional().describe('Geralmente preenchido automaticamente via pageContext — só informe se explicitamente outro.'),
            workspaceId: z.string().optional().describe('ID do workspace/estabelecimento, se a rota exigir.'),
            hierarchyId: z.string().optional().describe('ID da hierarquia (cargo/setor), se a rota exigir.'),
            homogeneousGroupId: z.string().optional().describe('ID do grupo homogêneo, se a rota exigir.'),
          })
          .optional()
          .describe('Parâmetros de rota/modal. companyId é preenchido automaticamente do contexto da página.'),
      }),
    },
  );

  return [proposeNavigationTool];
}
