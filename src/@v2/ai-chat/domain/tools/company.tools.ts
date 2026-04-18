import { tool, type StructuredToolInterface } from '@langchain/core/tools';
import type { PrismaClient } from '@prisma/client';
import Fuse from 'fuse.js';
import { z } from 'zod';
import { normalizeString } from '../../../../shared/utils/normalizeString';
import { withErrorHandling } from './tool-error-handler';

export interface CompanyToolsDeps {
  prisma: PrismaClient;
  userId: number;
  defaultCompanyId?: string;
}

export function createCompanyTools(deps: CompanyToolsDeps): StructuredToolInterface[] {
  const { prisma, userId, defaultCompanyId } = deps;

  const searchAccessibleCompaniesTool = tool(
    async ({ searchTerm, page = 1, pageSize = 20 }) => {
      const directAccessFilter = { users: { some: { userId, status: 'ACTIVE' as const } } };

      const companies = await prisma.company.findMany({
        where: {
          status: 'ACTIVE',
          deleted_at: null,
          OR: [
            directAccessFilter,
            {
              receivingServiceContracts: {
                some: {
                  status: 'ACTIVE',
                  applyingServiceCompany: directAccessFilter,
                },
              },
            },
            {
              applyingServiceContracts: {
                some: {
                  status: 'ACTIVE',
                  receivingServiceCompany: directAccessFilter,
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          fantasy: true,
          cnpj: true,
          initials: true,
          shortName: true,
          isConsulting: true,
          isClinic: true,
          isGroup: true,
          users: {
            where: { userId, status: 'ACTIVE' },
            select: { userId: true },
          },
        },
      });

      const enriched = companies.map((c) => {
        const { users, ...rest } = c;
        const hasDirectAccess = (users?.length ?? 0) > 0;
        return {
          ...rest,
          acessoVia: hasDirectAccess ? ('direto' as const) : ('contrato' as const),
        };
      });

      let results: ((typeof enriched)[0] & { score: number })[];

      if (searchTerm) {
        // Condensed = lowercase, no diacritics, no non-alphanumerics (so "Mac Donal's" → "macdonals").
        // This catches user typos that elide spaces/punctuation, e.g. "macdonalds" → matches "Mac Donals".
        const condense = (v?: string | null) => (normalizeString(v ?? undefined) ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

        const normalized = enriched.map((c) => ({
          ...c,
          normalizedName: normalizeString(c.name)?.toLowerCase() || '',
          normalizedFantasy: normalizeString(c.fantasy)?.toLowerCase() || '',
          normalizedInitials: normalizeString(c.initials)?.toLowerCase() || '',
          normalizedShortName: normalizeString(c.shortName)?.toLowerCase() || '',
          normalizedCnpj: (c.cnpj || '').replace(/\D/g, ''),
          condensedName: condense(c.name),
          condensedFantasy: condense(c.fantasy),
          condensedShortName: condense(c.shortName),
        }));

        const normalizedTerm = normalizeString(searchTerm)?.toLowerCase() || searchTerm;
        const condensedTerm = condense(searchTerm);

        const fuse = new Fuse(normalized, {
          keys: [
            { name: 'normalizedName', weight: 0.2 },
            { name: 'normalizedFantasy', weight: 0.2 },
            { name: 'condensedName', weight: 0.2 },
            { name: 'condensedFantasy', weight: 0.2 },
            { name: 'condensedShortName', weight: 0.05 },
            { name: 'normalizedInitials', weight: 0.05 },
            { name: 'normalizedCnpj', weight: 0.1 },
          ],
          threshold: 0.5,
          distance: 200,
          includeScore: true,
          ignoreLocation: true,
          minMatchCharLength: 2,
        });

        // Run both queries (raw and condensed) and merge; some terms only hit on one variant.
        const merged = new Map<string, { item: (typeof normalized)[0]; score: number }>();
        for (const r of fuse.search(normalizedTerm)) {
          merged.set(r.item.id, { item: r.item, score: r.score ?? 1 });
        }
        if (condensedTerm && condensedTerm !== normalizedTerm) {
          for (const r of fuse.search(condensedTerm)) {
            const existing = merged.get(r.item.id);
            if (!existing || (r.score ?? 1) < existing.score) {
              merged.set(r.item.id, { item: r.item, score: r.score ?? 1 });
            }
          }
        }

        results = Array.from(merged.values()).map(({ item, score }) => {
          const { normalizedName, normalizedFantasy, normalizedInitials, normalizedShortName, normalizedCnpj, condensedName, condensedFantasy, condensedShortName, ...rest } = item;
          return { ...rest, score: 1 - score };
        });
      } else {
        results = enriched.map((c) => ({ ...c, score: 1 }));
      }

      results.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.name.localeCompare(b.name);
      });

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginated = results.slice(startIndex, endIndex);
      const totalCount = results.length;
      const hasNextPage = endIndex < totalCount;

      if (paginated.length === 0) {
        return JSON.stringify({
          mensagem: 'Nenhuma empresa acessível encontrada com esses critérios.',
          sugestao: searchTerm
            ? 'Verifique a grafia do nome ou tente outro identificador (CNPJ, iniciais, nome fantasia).'
            : 'Nenhuma empresa acessível para este usuário.',
        });
      }

      const simplified = paginated.map((c) => ({
        id: c.id,
        nome: c.name,
        nomeFantasia: c.fantasy ?? undefined,
        cnpj: c.cnpj ?? undefined,
        iniciais: c.initials ?? undefined,
        nomeCurto: c.shortName ?? undefined,
        isConsultoria: c.isConsulting || undefined,
        isClinica: c.isClinic || undefined,
        isGrupo: c.isGroup || undefined,
        empresaAtual: defaultCompanyId && c.id === defaultCompanyId ? true : undefined,
        acessoVia: c.acessoVia,
      }));

      return JSON.stringify(
        {
          total: totalCount,
          pagina: page,
          tamanhoPagina: pageSize,
          temProximaPagina: hasNextPage,
          empresas: simplified,
          dica:
            'Use o "id" retornado como parâmetro "companyId" em propor_navegacao (para abrir páginas dessa empresa) ' +
            'ou nas ferramentas de consulta (listar_riscos_por_tipo, buscar_grupos_homogeneos, buscar_hierarquias).',
        },
        null,
        2,
      );
    },
    {
      name: 'buscar_empresas_acessiveis',
      description:
        'Busca empresas às quais o usuário tem acesso, usando fuzzy matching sobre nome (razão social), nome fantasia, CNPJ, iniciais e nome curto. ' +
        'Use SEMPRE que o usuário mencionar uma empresa pelo nome (mesmo com erro de grafia, ex: "macdonalds") e você precisar do "id" para navegar ou consultar dados. ' +
        'O resultado traz o "id" da empresa — use esse id como parâmetro "companyId" em propor_navegacao, listar_riscos_por_tipo, buscar_grupos_homogeneos, buscar_hierarquias e propor_atualizacao_risco. ' +
        'Retorna apenas empresas que o usuário tem permissão de acessar.',
      schema: z.object({
        _actionDescription: z.string().describe('Breve descrição do que você está fazendo. DEVE estar no MESMO IDIOMA do usuário.'),
        searchTerm: z
          .string()
          .optional()
          .describe(
            'Texto digitado pelo usuário para identificar a empresa: pode ser nome, razão social, nome fantasia, CNPJ (com ou sem pontuação), iniciais ou nome curto. ' +
              'Se o usuário não informar nenhum termo, omita este campo para listar todas as empresas acessíveis.',
          ),
        page: z.number().int().min(1).optional().default(1).describe('Número da página (padrão 1).'),
        pageSize: z.number().int().min(1).optional().default(20).describe('Resultados por página (padrão 20).'),
      }),
    },
  );

  return [withErrorHandling(searchAccessibleCompaniesTool)];
}
