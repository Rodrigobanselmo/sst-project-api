import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { getOriginHomogeneousGroup } from '@/@v2/shared/domain/functions/security/get-origin-homogeneous-group.func';
import { RiskDataMapper } from '@/@v2/documents/database/mappers/risk-data.mapper';
import { tool } from '@langchain/core/tools';
import type { PrismaClient } from '@prisma/client';
import Fuse from 'fuse.js';
import { z } from 'zod';
import { normalizeString } from '../../../../shared/utils/normalizeString';
import { CharacterizationTypeTranslation, HierarchyTypeTranslation, HomoTypeTranslation } from '../../translations/characterization.translation';
import { withErrorHandling } from './tool-error-handler';
import { QuantityTypeEnum } from '@/@v2/shared/domain/enum/security/quantity-type.enum';
import { RiskDataQuantityHeatVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-heat.vo';
import { RiskDataQuantityNoiseVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-noise.vo';
import { RiskDataQuantityQuiVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-qui.vo';
import { RiskDataQuantityRadiationVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-radiation.vo';
import { RiskDataQuantityVibrationFBVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-fb.vo';
import { RiskDataQuantityVibrationLVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-l.vo';

export function createCharacterizationTools(deps: { prisma: PrismaClient; defaultCompanyId: string }) {
  const { prisma, defaultCompanyId } = deps;

  const searchRisksByTypeTool = tool(
    async ({ riskTypes, companyId }) => {
      // Require at least one risk type to prevent fetching all risks
      if (!riskTypes || riskTypes.length === 0) {
        return JSON.stringify({
          erro: 'Tipo de risco obrigatório',
          mensagem: 'Por favor, especifique pelo menos um tipo de risco: BIO, QUI, FIS, ERG, ACI ou OUTROS',
        });
      }

      // Use provided companyId or fall back to the default (company being viewed)
      const targetCompanyId = companyId ?? defaultCompanyId;

      // Get current company info to check if it has consulting contracts
      const currentCompany = await prisma.company.findUnique({
        where: { id: targetCompanyId },
        select: {
          id: true,
          receivingServiceContracts: {
            where: { status: 'ACTIVE' },
            select: {
              applyingServiceCompanyId: true,
            },
          },
        },
      });

      // Build list of company IDs to search from
      // 1. The target company itself
      // 2. Consulting companies that have active contracts with the target company
      const companyIdsToSearch = [targetCompanyId];

      if (currentCompany?.receivingServiceContracts) {
        currentCompany.receivingServiceContracts.forEach((contract) => {
          companyIdsToSearch.push(contract.applyingServiceCompanyId);
        });
      }

      const isPsic = riskTypes.includes('PSIC');
      // replcate PSIC with ERG
      const riskTypesWithErg = riskTypes.map((t) => t.replace('PSIC', 'ERG')) as any[];

      const risks = await prisma.riskFactors.findMany({
        where: {
          status: 'ACTIVE',
          deleted_at: null,
          OR: [
            // System risks (available to everyone)
            { system: true },
            // Risks from the target company or consulting companies
            { companyId: { in: companyIdsToSearch } },
          ],
          type: { in: riskTypesWithErg },
          ...(isPsic ? { subTypes: { some: { sub_type: { sub_type: 'PSICOSOCIAL' } } } } : {}),
        },
        select: {
          id: true,
          name: true,
          type: true,
          cas: true,
          synonymous: true,
          appendix: true,
          otherAppendix: true,
        },
        orderBy: [{ type: 'asc' }, { severity: 'desc' }, { name: 'asc' }],
      });

      if (risks.length === 0) {
        return JSON.stringify({
          mensagem: 'Nenhum risco encontrado para os tipos especificados.',
          tipos: riskTypes,
        });
      }

      const simplified = risks.map((r) => {
        const result: any = {
          id: r.id,
          nome: r.name,
          tipo: r.type,
        };

        // Only include appendix if it exists
        if (r.appendix) {
          result.anexo = r.appendix;
        }

        if (r.otherAppendix) {
          result.outroAnexo = r.otherAppendix;
        }

        if (r.cas) {
          result.cas = r.cas;
        }

        if (r.synonymous) {
          result.sinonimos = r.synonymous;
        }

        return result;
      });

      return JSON.stringify(
        {
          total: risks.length,
          riscos: simplified,
          dica: 'Use a ferramenta obter_detalhes_risco com o ID para ver informações completas (sintomas, propagação, etc.)',
        },
        null,
        2,
      );
    },
    {
      name: 'listar_riscos_por_tipo',
      description:
        'Lista os riscos (fatores de risco) do sistema filtrados por tipo. OBRIGATÓRIO especificar pelo menos um tipo. Tipos: BIO (Biológico), QUI (Químico), FIS (Físico), ERG (Ergonômico), ACI (Acidente), OUTROS. Retorna lista resumida com id, nome, tipo, severidade e anexo (se houver).',
      schema: z.object({
        _actionDescription: z.string().describe('Escreva uma breve descrição do que você está fazendo. DEVE ser no MESMO IDIOMA que o usuário está usando.'),
        riskTypes: z
          .array(z.enum(['BIO', 'QUI', 'FIS', 'ERG', 'ACI', 'OUTROS', 'PSIC']))
          .min(1)
          .describe('Array com os tipos de risco para filtrar (OBRIGATÓRIO). Exemplos: ["BIO"], ["FIS", "QUI"], ["ACI"]'),
        companyId: z
          .string()
          .optional()
          .describe('ID da empresa para listar riscos. Se não especificado, usa a empresa que o usuário está visualizando. Use quando o usuário pedir para buscar em outra empresa específica.'),
      }),
    },
  );

  const searchHomogeneousGroupsTool = tool(
    async ({ searchTerm, groupTypes, page = 1, pageSize = 20, companyId }) => {
      // Use provided companyId or fall back to the default (company being viewed)
      const targetCompanyId = companyId ?? defaultCompanyId;

      // Build the where clause (fetch all matching type, then fuzzy match in-memory)
      const where: any = {
        status: 'ACTIVE',
        deletedAt: null,
        companyId: targetCompanyId,
      };

      // Add type filter if provided
      if (groupTypes && groupTypes.length > 0) {
        where.type = { in: groupTypes };
      }

      // Fetch all groups matching the type filter (no name filter in DB)
      const allGroups = await prisma.homogeneousGroup.findMany({
        where,
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          workspaces: {
            select: {
              name: true,
            },
          },
        },
      });

      // Apply fuzzy matching using Fuse.js if searchTerm is provided
      let results: ((typeof allGroups)[0] & { score: number })[];

      if (searchTerm) {
        // Normalize groups data for accent-insensitive search
        const normalizedGroups = allGroups.map((g) => ({
          ...g,
          normalizedName: normalizeString(g.name)?.toLowerCase() || '',
          normalizedDescription: normalizeString(g.description)?.toLowerCase() || '',
        }));

        // Normalize search term
        const normalizedSearchTerm = normalizeString(searchTerm)?.toLowerCase() || searchTerm;

        // Configure Fuse.js for fuzzy search on normalized data
        const fuse = new Fuse(normalizedGroups, {
          keys: ['normalizedName', 'normalizedDescription'],
          threshold: 0.4, // 0 = exact match, 1 = match anything (0.4 is a good balance)
          includeScore: true,
          ignoreLocation: true, // Search anywhere in the string
          minMatchCharLength: 2,
        });

        // Perform fuzzy search with normalized term
        const fuseResults = fuse.search(normalizedSearchTerm);

        // Map results with score (Fuse.js score: 0 = perfect match, 1 = no match)
        // We invert it so higher score = better match
        // Remove normalized fields from results
        results = fuseResults.map((result) => {
          const { normalizedName, normalizedDescription, ...itemWithoutNormalized } = result.item;
          return {
            ...itemWithoutNormalized,
            score: 1 - (result.score ?? 0),
          };
        });
      } else {
        // No search term - return all with perfect score
        results = allGroups.map((g) => ({ ...g, score: 1 }));
      }

      // Sort by score (descending), then by type and name
      results.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.type !== b.type) return a.type.localeCompare(b.type);
        return a.name.localeCompare(b.name);
      });

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedGroups = results.slice(startIndex, endIndex);
      const totalCount = results.length;
      const hasNextPage = endIndex < totalCount;

      if (paginatedGroups.length === 0) {
        return JSON.stringify({
          mensagem: 'Nenhum grupo encontrado com os critérios fornecidos.',
          sugestao: searchTerm ? 'Tente buscar com um termo diferente ou sem filtro de tipo.' : 'Tente adicionar um termo de busca ou filtro de tipo.',
        });
      }

      const simplified = paginatedGroups.map((g) => ({
        id: g.id,
        nome: g.name,
        tipo: g.type,
        descricao: g.description,
        estabelecimentos: g.workspaces?.map((w: any) => w.name) ?? [],
      }));

      return JSON.stringify(
        {
          total: totalCount,
          pagina: page,
          tamanhoPagina: pageSize,
          temProximaPagina: hasNextPage,
          grupos: simplified,
          dica: 'Para ver informações completas (hierarquia, riscos, etc.), use a ferramenta obter_detalhes_grupo com o campo "id" EXATAMENTE como aparece acima (copie o UUID completo sem modificações). Use o parâmetro "page" para ver mais resultados.',
        },
        null,
        2,
      );
    },
    {
      name: 'buscar_grupos_homogeneos',
      description:
        'Busca grupos homogêneos (GHOs) por nome usando fuzzy matching (tolera erros de digitação). ' +
        'IMPORTANTE: NÃO use esta ferramenta para buscar CARGOS, SETORES ou DIRETORIAS - para isso use a ferramenta buscar_hierarquias. ' +
        'Esta ferramenta é para buscar: ENVIRONMENT (ambientes de trabalho), WORKSTATION (postos de trabalho), EQUIPMENT (equipamentos), ACTIVITIES (atividades). ' +
        'O tipo HIERARCHY existe apenas para compatibilidade técnica, mas consultas sobre estrutura organizacional devem usar buscar_hierarquias. ' +
        'Retorna lista resumida - use obter_detalhes_grupo para informações completas. Suporta paginação.',
      schema: z.object({
        _actionDescription: z.string().describe('Escreva uma breve descrição do que você está fazendo. DEVE ser no MESMO IDIOMA que o usuário está usando.'),
        searchTerm: z
          .string()
          .optional()
          .describe('Termo de busca para filtrar por nome (usa fuzzy matching, tolera erros de digitação). Exemplos: "Ambiente de Produção", "Posto de Soldagem", "Equipamento X"'),
        groupTypes: z
          .array(z.enum(['HIERARCHY', 'ENVIRONMENT', 'WORKSTATION', 'EQUIPMENT', 'ACTIVITIES']))
          .optional()
          .describe(
            'Array com os tipos de grupo para filtrar. ENVIRONMENT = ambientes, WORKSTATION = postos de trabalho, EQUIPMENT = equipamentos, ACTIVITIES = atividades. EVITE usar HIERARCHY - prefira buscar_hierarquias. Exemplos: ["ENVIRONMENT"], ["WORKSTATION", "EQUIPMENT"]',
          ),
        page: z.number().int().min(1).optional().default(1).describe('Número da página para paginação (padrão: 1). Use para ver mais resultados quando temProximaPagina=true.'),
        pageSize: z.number().int().min(1).optional().default(20).describe('Quantidade de resultados por página (padrão: 20, máximo recomendado: 50).'),
        companyId: z
          .string()
          .optional()
          .describe('ID da empresa para buscar grupos. Se não especificado, usa a empresa que o usuário está visualizando. Use quando o usuário pedir para buscar em outra empresa específica.'),
      }),
    },
  );

  const searchHierarchyTool = tool(
    async ({ searchTerm, hierarchyTypes, page = 1, pageSize = 20, companyId }) => {
      // Use provided companyId or fall back to the default (company being viewed)
      const targetCompanyId = companyId ?? defaultCompanyId;

      // Build the where clause
      const where: any = {
        status: 'ACTIVE',
        deletedAt: null,
        companyId: targetCompanyId,
      };

      // Add type filter if provided
      if (hierarchyTypes && hierarchyTypes.length > 0) {
        where.type = { in: hierarchyTypes };
      }

      // Fetch all hierarchies matching the type filter
      const allHierarchies = await prisma.hierarchy.findMany({
        where,
        select: {
          id: true,
          name: true,
          type: true,
          workspaces: {
            select: {
              name: true,
            },
          },
          parent: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });

      // Apply fuzzy matching using Fuse.js if searchTerm is provided
      let results: ((typeof allHierarchies)[0] & { score: number })[];

      if (searchTerm) {
        // Normalize hierarchies data for accent-insensitive search
        const normalizedHierarchies = allHierarchies.map((h) => ({
          ...h,
          normalizedName: normalizeString(h.name)?.toLowerCase() || '',
        }));

        // Normalize search term
        const normalizedSearchTerm = normalizeString(searchTerm)?.toLowerCase() || searchTerm;

        // Configure Fuse.js for fuzzy search on normalized data
        const fuse = new Fuse(normalizedHierarchies, {
          keys: ['normalizedName'],
          threshold: 0.4, // 0 = exact match, 1 = match anything (0.4 is a good balance)
          includeScore: true,
          ignoreLocation: true, // Search anywhere in the string
          minMatchCharLength: 2,
        });

        // Perform fuzzy search with normalized term
        const fuseResults = fuse.search(normalizedSearchTerm);

        // Map results with score (Fuse.js score: 0 = perfect match, 1 = no match)
        // We invert it so higher score = better match
        // Remove normalizedName from results
        results = fuseResults.map((result) => {
          const { normalizedName, ...itemWithoutNormalized } = result.item;
          return {
            ...itemWithoutNormalized,
            score: 1 - (result.score ?? 0),
          };
        });
      } else {
        // No search term - return all with perfect score
        results = allHierarchies.map((h) => ({ ...h, score: 1 }));
      }

      // Sort by score (descending), then by type and name
      results.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.type !== b.type) return a.type.localeCompare(b.type);
        return a.name.localeCompare(b.name);
      });

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedHierarchies = results.slice(startIndex, endIndex);
      const totalCount = results.length;
      const hasNextPage = endIndex < totalCount;

      if (paginatedHierarchies.length === 0) {
        return JSON.stringify({
          mensagem: 'Nenhuma hierarquia encontrada com os critérios fornecidos.',
          sugestao: searchTerm ? 'Tente buscar com um termo diferente ou sem filtro de tipo.' : 'Tente adicionar um termo de busca ou filtro de tipo.',
        });
      }

      const simplified = paginatedHierarchies.map((h) => ({
        id: h.id,
        nome: h.name,
        tipo: HierarchyTypeTranslation[h.type],
        tipoEmIngles: h.type,
        estabelecimentos: h.workspaces?.map((w: any) => w.name) ?? [],
        pai: h.parent
          ? {
              id: h.parent.id,
              nome: h.parent.name,
              tipo: HierarchyTypeTranslation[h.parent.type],
            }
          : null,
      }));

      return JSON.stringify(
        {
          total: totalCount,
          pagina: page,
          tamanhoPagina: pageSize,
          temProximaPagina: hasNextPage,
          hierarquias: simplified,
          dica: 'Use a ferramenta obter_detalhes_hierarquia com o ID para ver informações completas (hierarquia completa, grupos homogêneos, riscos, funcionários, etc.). Use o parâmetro "page" para ver mais resultados.',
        },
        null,
        2,
      );
    },
    {
      name: 'buscar_hierarquias',
      description:
        'Busca hierarquias organizacionais (cargos, setores, diretorias, superintendências, etc.) por nome usando fuzzy matching (tolera erros de digitação). ' +
        'IMPORTANTE: Use esta ferramenta quando o usuário perguntar sobre CARGOS, SETORES, DIRETORIAS ou qualquer elemento da estrutura organizacional hierárquica. ' +
        'Tipos: DIRECTORY (superintendência), MANAGEMENT (diretoria), SECTOR (setor), SUB_SECTOR (sub setor), OFFICE (cargo), SUB_OFFICE (cargo desenvolvido). ' +
        'Retorna lista resumida - use obter_detalhes_hierarquia para informações completas. Suporta paginação.',
      schema: z.object({
        _actionDescription: z.string().describe('Escreva uma breve descrição do que você está fazendo. DEVE ser no MESMO IDIOMA que o usuário está usando.'),
        searchTerm: z.string().optional().describe('Termo de busca para filtrar por nome (usa fuzzy matching, tolera erros de digitação). Exemplos: "Operador", "Setor Administrativo", "Diretoria"'),
        hierarchyTypes: z
          .array(z.enum(['DIRECTORY', 'MANAGEMENT', 'SECTOR', 'SUB_SECTOR', 'OFFICE', 'SUB_OFFICE']))
          .optional()
          .describe(
            'Array com os tipos de hierarquia para filtrar. DIRECTORY = superintendência, MANAGEMENT = diretoria, SECTOR = setor, SUB_SECTOR = sub setor, OFFICE = cargo, SUB_OFFICE = cargo desenvolvido. Exemplos: ["OFFICE"], ["SECTOR", "SUB_SECTOR"]',
          ),
        page: z.number().int().min(1).optional().default(1).describe('Número da página para paginação (padrão: 1). Use para ver mais resultados quando temProximaPagina=true.'),
        pageSize: z.number().int().min(1).optional().default(20).describe('Quantidade de resultados por página (padrão: 20, máximo recomendado: 50).'),
        companyId: z
          .string()
          .optional()
          .describe('ID da empresa para buscar hierarquias. Se não especificado, usa a empresa que o usuário está visualizando. Use quando o usuário pedir para buscar em outra empresa específica.'),
      }),
    },
  );

  const getGroupDetailsTool = tool(
    async ({ groupId }) => {
      const groupAwait = prisma.homogeneousGroup.findFirst({
        where: {
          id: groupId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          workspaces: {
            select: {
              name: true,
            },
          },
          characterization: {
            select: {
              id: true,
              name: true,
              type: true,
              activities: true,
              description: true,
            },
          },
          riskFactorData: {
            where: { deletedAt: null },
            select: {
              id: true,
              riskFactor: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  severity: true,
                },
              },
            },
            // No limit - show all risks
          },
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      const hierarchyAwait = prisma.hierarchy.findFirst({
        where: {
          id: groupId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          realDescription: true,
          company: {
            select: {
              name: true,
            },
          },
          workspaces: {
            select: {
              name: true,
            },
          },
          parent: {
            select: {
              id: true,
              name: true,
              type: true,
              parent: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  parent: {
                    select: {
                      id: true,
                      name: true,
                      type: true,
                      parent: {
                        select: {
                          id: true,
                          name: true,
                          type: true,
                          parent: {
                            select: {
                              id: true,
                              name: true,
                              type: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      let [group, hierarchy] = await Promise.all([groupAwait, hierarchyAwait]);

      if (!group && !hierarchy) {
        return JSON.stringify({
          erro: 'Grupo não encontrado',
          mensagem: 'O grupo com este ID não existe ou foi deletado.',
        });
      }

      if (!group || group.type === 'HIERARCHY') {
        group = {
          id: hierarchy.id,
          riskFactorData: [],
          description: '',
          characterization: null,
          ...group,
          // override group with hierarchy data
          name: hierarchy.name,
          type: HomoTypeEnum.HIERARCHY,
          workspaces: hierarchy.workspaces,
          company: hierarchy.company,
        };
      }

      const isCharacterization = group.description.includes('(//)');
      const groupName = isCharacterization ? group.description.split('(//)')[0] : group.name;

      const result: any = {
        id: group.id,
        nome: groupName,
        tipo: HomoTypeTranslation[group.type],
        tipoEmIngles: group.type,
        descricao: isCharacterization ? '' : group.description,
        estabelecimentos: group.workspaces?.map((w) => w.name) ?? [],
        empresa: group.company?.name,
      };

      // Build hierarchy context (from bottom to top)
      const hierarchyContext: any[] = [];
      if (hierarchy) {
        // Build path from top to bottom
        let current = hierarchy;
        const chain: any[] = [];
        while (current) {
          chain.unshift({ nome: current.name, tipo: HierarchyTypeTranslation[current.type], id: current.id });
          current = current.parent as any;
        }

        hierarchyContext.push(chain);
      }

      // Add hierarchy context if HIERARCHY type
      if (group.type === 'HIERARCHY') {
        if (hierarchyContext.length > 0) result.contextoHierarquico = hierarchyContext[0];
        result.nome = `${hierarchy.name} (${HierarchyTypeTranslation[hierarchy.type]})`;

        result.hierarquia = {
          id: hierarchy.id,
          nome: hierarchy.name,
          tipo: HierarchyTypeTranslation[hierarchy.type],
          tipoEmIngles: hierarchy.type,
          descricao: hierarchy.description,
          descricaoReal: hierarchy.realDescription,
        };
      }

      // Add characterization info if available
      if (group.characterization) {
        result.caracterizacao = {
          id: group.characterization.id,
          nome: group.characterization.name,
          tipo: CharacterizationTypeTranslation[group.characterization.type],
          tipoEmIngles: group.characterization.type,
          atividades: group.characterization.activities,
          descricao: group.characterization.description,
        };
      }

      // Add risks summary (all risks, no limit)
      if (group.riskFactorData && group.riskFactorData.length > 0) {
        result.riscos = {
          total: group.riskFactorData.length,
          lista: group.riskFactorData.map((rd) => ({
            id: rd.riskFactor.id,
            nome: rd.riskFactor.name,
            tipo: rd.riskFactor.type,
            severidade: rd.riskFactor.severity,
          })),
        };
      }

      return JSON.stringify(result, null, 2);
    },
    {
      name: 'obter_detalhes_grupo',
      description:
        'Obtém informações detalhadas de um grupo homogêneo específico, incluindo caracterização (para ENVIRONMENT/WORKSTATION/EQUIPMENT/ACTIVITIES) e riscos associados. ' +
        'IMPORTANTE: Para obter detalhes de CARGOS, SETORES ou DIRETORIAS, use a ferramenta obter_detalhes_hierarquia ao invés desta. ' +
        'Use após buscar_grupos_homogeneos.',
      schema: z.object({
        _actionDescription: z.string().describe('Escreva uma breve descrição do que você está fazendo. DEVE ser no MESMO IDIOMA que o usuário está usando.'),
        groupId: z
          .string()
          .uuid()
          .describe(
            'ID UUID do grupo homogêneo (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx). ' +
              'Obtenha este ID EXATAMENTE como retornado pela ferramenta buscar_grupos_homogeneos no campo "id". ' +
              'NÃO concatene, NÃO modifique, NÃO adicione outros valores. Use APENAS o UUID completo.',
          ),
      }),
    },
  );

  const getRiskDetailsTool = tool(
    async ({ riskId }) => {
      const risk = await prisma.riskFactors.findFirst({
        where: {
          id: riskId,
          deleted_at: null,
        },
        select: {
          id: true,
          name: true,
          type: true,
          severity: true,
          esocialCode: true,
          // NR-15 / NR-16 related fields
          appendix: true,
          otherAppendix: true,
          grauInsalubridade: true,
          // Exposure limits and regulatory data
          tlv: true, // Threshold Limit Value
          nr15lt: true, // NR-15 Limite de Tolerância
          twa: true, // Time Weighted Average
          stel: true, // Short Term Exposure Limit
          ipvs: true, // Immediately Dangerous to Life or Health
          pv: true, // Valor de Pico
          pe: true, // Permissible Exposure
          // Chemical identification
          cas: true, // CAS number
          fraction: true, // Fração (respirável, inalável, etc.)
          unit: true, // Unidade de medida
          // Carcinogenicity
          carnogenicityACGIH: true,
          carnogenicityLinach: true,
          // Health and safety info
          symptoms: true,
          propagation: true,
          method: true, // Método de avaliação
          breather: true, // Respirador recomendado
          exame: true, // Exames recomendados
          // Additional info
          activities: true,
          coments: true,
          synonymous: true,
          risk: true, // Descrição do risco
          // Subtypes
          subTypes: {
            select: {
              sub_type: {
                select: {
                  id: true,
                  name: true,
                  sub_type: true,
                },
              },
            },
          },
        },
      });

      if (!risk) {
        return JSON.stringify({
          erro: 'Risco não encontrado',
          mensagem: 'O risco com este ID não existe ou não está disponível para esta empresa.',
        });
      }

      const result: any = {
        id: risk.id,
        nome: risk.name,
        tipo: risk.type,
        severidade: risk.severity,
      };

      // Regulatory compliance data (NR-15, NR-16, etc.)
      const dadosNormativos: any = {};
      if (risk.esocialCode) dadosNormativos.codigoESocial = risk.esocialCode;
      if (risk.appendix) dadosNormativos.anexoNR15 = risk.appendix;
      if (risk.otherAppendix) dadosNormativos.outrosAnexos = risk.otherAppendix;
      if (risk.grauInsalubridade) dadosNormativos.grauInsalubridade = risk.grauInsalubridade;
      if (Object.keys(dadosNormativos).length > 0) result.dadosNormativos = dadosNormativos;

      // Exposure limits and tolerance levels
      const limitesExposicao: any = {};
      if (risk.tlv) limitesExposicao.TLV = risk.tlv; // Threshold Limit Value (ACGIH)
      if (risk.nr15lt) limitesExposicao.limiteToleranciaNR15 = risk.nr15lt;
      if (risk.twa) limitesExposicao.TWA = risk.twa; // Time Weighted Average
      if (risk.stel) limitesExposicao.STEL = risk.stel; // Short Term Exposure Limit
      if (risk.ipvs) limitesExposicao.IPVS = risk.ipvs; // Immediately Dangerous to Life or Health
      if (risk.pv) limitesExposicao.valorPico = risk.pv;
      if (risk.pe) limitesExposicao.exposicaoPermissivel = risk.pe;
      if (risk.unit) limitesExposicao.unidade = risk.unit;
      if (Object.keys(limitesExposicao).length > 0) result.limitesExposicao = limitesExposicao;

      // Chemical identification (for QUI type)
      if (risk.type === 'QUI') {
        const identificacaoQuimica: any = {};
        if (risk.cas) identificacaoQuimica.numeroCAS = risk.cas;
        if (risk.fraction) identificacaoQuimica.fracao = risk.fraction;
        if (risk.carnogenicityACGIH) identificacaoQuimica.carcinogenicidadeACGIH = risk.carnogenicityACGIH;
        if (risk.carnogenicityLinach) identificacaoQuimica.carcinogenicidadeLinach = risk.carnogenicityLinach;
        if (Object.keys(identificacaoQuimica).length > 0) result.identificacaoQuimica = identificacaoQuimica;
      }

      // Health and safety information
      const informacoesSaude: any = {};
      if (risk.symptoms) informacoesSaude.sintomas = risk.symptoms;
      if (risk.propagation && risk.propagation.length > 0) informacoesSaude.viaPropagacao = risk.propagation;
      if (risk.exame) informacoesSaude.examesRecomendados = risk.exame;
      if (Object.keys(informacoesSaude).length > 0) result.informacoesSaude = informacoesSaude;

      // Assessment and control methods
      const metodosControle: any = {};
      if (risk.method) metodosControle.metodoAvaliacao = risk.method;
      if (risk.breather) metodosControle.respiradorRecomendado = risk.breather;
      if (Object.keys(metodosControle).length > 0) result.metodosControle = metodosControle;

      // Additional information
      if (risk.risk) result.descricaoRisco = risk.risk;
      if (risk.coments) result.comentarios = risk.coments;
      if (risk.synonymous && risk.synonymous.length > 0) result.sinonimos = risk.synonymous;
      if (Array.isArray(risk.activities) && risk.activities.length > 0) result.atividades = risk.activities;
      if (risk.subTypes && risk.subTypes.length > 0) {
        result.subTipos = risk.subTypes.map((st) => ({
          id: st.sub_type.id,
          nome: st.sub_type.name,
          categoria: st.sub_type.sub_type,
        }));
      }

      return JSON.stringify(result, null, 2);
    },
    {
      name: 'obter_detalhes_risco',
      description:
        'Obtém informações COMPLETAS de um risco específico, incluindo: ' +
        '(1) Dados Normativos: código eSocial, anexos NR-15/NR-16, grau de insalubridade; ' +
        '(2) Limites de Exposição: TLV, TWA, STEL, IPVS, limites de tolerância NR-15; ' +
        '(3) Identificação Química (para riscos químicos): número CAS, fração, carcinogenicidade; ' +
        '(4) Informações de Saúde: sintomas, vias de propagação, exames recomendados; ' +
        '(5) Métodos de Controle: métodos de avaliação, respiradores recomendados. ' +
        'Use após listar_riscos_por_tipo para obter dados técnicos completos.',
      schema: z.object({
        _actionDescription: z.string().describe('Escreva uma breve descrição do que você está fazendo. DEVE ser no MESMO IDIOMA que o usuário está usando.'),
        riskId: z.string().describe('ID do risco obtido da ferramenta listar_riscos_por_tipo'),
      }),
    },
  );

  const getHierarchyDetailsTool = tool(
    async ({ hierarchyId }) => {
      const hierarchy = await prisma.hierarchy.findFirst({
        where: {
          id: hierarchyId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          realDescription: true,
          companyId: true,
          workspaces: {
            select: {
              id: true,
              name: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
          parent: {
            select: {
              id: true,
              name: true,
              type: true,
              parent: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  parent: {
                    select: {
                      id: true,
                      name: true,
                      type: true,
                      parent: {
                        select: {
                          id: true,
                          name: true,
                          type: true,
                          parent: {
                            select: {
                              id: true,
                              name: true,
                              type: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          hierarchyOnHomogeneous: {
            where: {
              homogeneousGroup: {
                deletedAt: null,
                type: { not: 'HIERARCHY' },
              },
            },
            select: {
              homogeneousGroup: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  description: true,
                },
              },
            },
          },
        },
      });

      if (!hierarchy) {
        return JSON.stringify({
          erro: 'Hierarquia não encontrada',
          mensagem: 'A hierarquia com este ID não existe ou foi deletada.',
        });
      }

      const result: any = {
        id: hierarchy.id,
        nome: hierarchy.name,
        tipo: HierarchyTypeTranslation[hierarchy.type],
        tipoEmIngles: hierarchy.type,
        descricao: hierarchy.description,
        descricaoReal: hierarchy.realDescription,
        estabelecimentos: hierarchy.workspaces?.map((w) => ({ id: w.id, nome: w.name })) ?? [],
        empresa: hierarchy.company?.name,
      };

      // Build hierarchy context (from bottom to top)
      if (hierarchy.parent) {
        const chain: any[] = [];
        let current = hierarchy.parent;
        while (current) {
          chain.unshift({
            id: current.id,
            nome: current.name,
            tipo: HierarchyTypeTranslation[current.type],
            tipoEmIngles: current.type,
          });
          current = current.parent as any;
        }
        result.hierarquiaSuperior = chain;
      }

      // Add homogeneous groups info
      if (hierarchy.hierarchyOnHomogeneous && hierarchy.hierarchyOnHomogeneous.length > 0) {
        result.gruposHomogeneos = hierarchy.hierarchyOnHomogeneous.map((hoh) => {
          const isCharacterization = hoh.homogeneousGroup.description.includes('(//)');
          const groupName = isCharacterization ? hoh.homogeneousGroup.description.split('(//)')[0] : hoh.homogeneousGroup.name;

          return {
            id: hoh.homogeneousGroup.id,
            nome: groupName,
            tipo: HomoTypeTranslation[hoh.homogeneousGroup.type],
            tipoEmIngles: hoh.homogeneousGroup.type,
            descricao: isCharacterization ? '' : hoh.homogeneousGroup.description,
          };
        });
      }

      // Find the first homogeneous group of type HIERARCHY linked to this hierarchy
      const hierarchyHomoGroup = await prisma.homogeneousGroup.findFirst({
        where: {
          type: 'HIERARCHY',
          deletedAt: null,
          hierarchyOnHomogeneous: {
            some: {
              hierarchyId: hierarchyId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          riskFactorData: {
            where: { deletedAt: null },
            select: {
              id: true,
              riskFactor: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  severity: true,
                },
              },
            },
          },
        },
      });

      // Add risks directly linked to the hierarchy (through HIERARCHY type homogeneous group)
      if (hierarchyHomoGroup && hierarchyHomoGroup.riskFactorData && hierarchyHomoGroup.riskFactorData.length > 0) {
        result.riscos = {
          total: hierarchyHomoGroup.riskFactorData.length,
          lista: hierarchyHomoGroup.riskFactorData.map((rd) => ({
            id: rd.riskFactor.id,
            nome: rd.riskFactor.name,
            tipo: rd.riskFactor.type,
            severidade: rd.riskFactor.severity,
          })),
        };
      }

      return JSON.stringify(result, null, 2);
    },
    {
      name: 'obter_detalhes_hierarquia',
      description:
        'Obtém informações detalhadas de uma hierarquia específica (cargo, setor, diretoria, superintendência, etc.), incluindo: hierarquia superior completa (pais), grupos homogêneos associados, estabelecimentos E RISCOS VINCULADOS DIRETAMENTE. ' +
        'IMPORTANTE SOBRE RISCOS: Esta ferramenta retorna APENAS os riscos vinculados DIRETAMENTE àquela hierarquia específica (cargo/setor). ' +
        'Riscos podem ser vinculados de 3 formas: (1) Diretamente ao cargo, (2) Através de grupos homogêneos que o cargo pertence, (3) Através da hierarquia superior (cargo herda riscos do setor pai). ' +
        'Esta ferramenta retorna SOMENTE os riscos da forma (1) - vinculados diretamente ao cargo. ' +
        'Para obter TODOS os riscos (incluindo herdados da hierarquia superior e de grupos homogêneos), use a ferramenta obter_riscos_hierarquia. ' +
        'QUANDO USAR: Use esta ferramenta quando o usuário perguntar sobre informações gerais de um CARGO, SETOR ou DIRETORIA (nome, descrição, estrutura, grupos homogêneos). ' +
        'Use após buscar_hierarquias ou quando já souber o ID da hierarquia.',
      schema: z.object({
        _actionDescription: z.string().describe('Escreva uma breve descrição do que você está fazendo. DEVE ser no MESMO IDIOMA que o usuário está usando.'),
        hierarchyId: z.string().describe('ID da hierarquia obtido da ferramenta buscar_hierarquias'),
      }),
    },
  );

  const getRisksByHierarchyTool = tool(
    async ({ hierarchyId }) => {
      // First, get the hierarchy with all its parents
      const hierarchy = await prisma.hierarchy.findFirst({
        where: {
          id: hierarchyId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          type: true,
          companyId: true,
          parent: {
            select: {
              id: true,
              name: true,
              type: true,
              parent: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  parent: {
                    select: {
                      id: true,
                      name: true,
                      type: true,
                      parent: {
                        select: {
                          id: true,
                          name: true,
                          type: true,
                          parent: {
                            select: {
                              id: true,
                              name: true,
                              type: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!hierarchy) {
        return JSON.stringify({
          erro: 'Hierarquia não encontrada',
          mensagem: 'A hierarquia com este ID não existe ou foi deletada.',
        });
      }

      // Build array of hierarchy IDs (current + all parents)
      const hierarchyIds: string[] = [hierarchy.id];
      let current = hierarchy.parent;
      while (current) {
        hierarchyIds.push(current.id);
        current = (current as any).parent;
      }

      // Find all risks associated with these hierarchies through homogeneous groups
      const risks = await prisma.riskFactors.findMany({
        where: {
          representAll: false,
          deleted_at: null,
          status: 'ACTIVE',
          riskFactorData: {
            some: {
              companyId: hierarchy.companyId,
              homogeneousGroup: {
                hierarchyOnHomogeneous: {
                  some: {
                    hierarchyId: { in: hierarchyIds },
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          type: true,
          severity: true,
          esocialCode: true,
          cas: true,
          riskFactorData: {
            where: {
              companyId: hierarchy.companyId,
              homogeneousGroup: {
                hierarchyOnHomogeneous: {
                  some: {
                    hierarchyId: { in: hierarchyIds },
                  },
                },
              },
            },
            select: {
              id: true,
              probability: true,
              probabilityAfter: true,
              level: true,
              homogeneousGroup: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  characterization: {
                    select: {
                      name: true,
                      type: true,
                    },
                  },
                  hierarchyOnHomogeneous: {
                    where: {
                      hierarchyId: { in: hierarchyIds },
                    },
                    select: {
                      hierarchy: {
                        select: {
                          id: true,
                          name: true,
                          type: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: [{ type: 'asc' }, { severity: 'desc' }, { name: 'asc' }],
      });

      if (risks.length === 0) {
        return JSON.stringify({
          mensagem: 'Nenhum risco encontrado para esta hierarquia',
          hierarquia: {
            id: hierarchy.id,
            nome: hierarchy.name,
            tipo: HierarchyTypeTranslation[hierarchy.type],
          },
          totalRiscos: 0,
        });
      }

      // Map risk types to Portuguese
      const RiskTypeTranslation: Record<string, string> = {
        FIS: 'Físico',
        QUI: 'Químico',
        BIO: 'Biológico',
        ERG: 'Ergonômico',
        ACI: 'Acidente',
        OUTROS: 'Outros',
      };

      // Categorize risks by origin type
      const riscosProprios: any[] = []; // risks directly on this hierarchy
      const riscosHerdadosHierarquia: Record<string, { origem: any; riscos: any[] }> = {}; // inherited from parent hierarchies
      const riscosDeGrupos: Record<string, { origem: any; riscos: any[] }> = {}; // from homogeneous groups (environments, workstations, etc.)
      const allRisks: any[] = [];

      risks.forEach((risk) => {
        risk.riskFactorData.forEach((riskData) => {
          const originHierarchy = riskData.homogeneousGroup.hierarchyOnHomogeneous[0]?.hierarchy;
          if (!originHierarchy) return;

          const group = riskData.homogeneousGroup;
          const isHierarchyGroup = group.type === HomoTypeEnum.HIERARCHY;
          const isFromSelf = originHierarchy.id === hierarchy.id;

          const origin = getOriginHomogeneousGroup({
            name: group.name,
            type: group.type as HomoTypeEnum,
            characterization: group.characterization as { name: string; type: any } | null,
            hierarchy: isHierarchyGroup ? { name: originHierarchy.name, type: originHierarchy.type as any } : null,
          });

          const riskInfo: any = {
            id: risk.id,
            nome: risk.name,
            tipo: RiskTypeTranslation[risk.type] || risk.type,
            tipoEmIngles: risk.type,
            severidade: risk.severity,
            ...(risk.cas && { cas: risk.cas }),
            nivelRisco: riskData.level,
            probabilidade: riskData.probability,
            ...(riskData.probabilityAfter && { probabilidadeApos: riskData.probabilityAfter }),
          };

          allRisks.push(riskInfo);

          if (isHierarchyGroup && isFromSelf) {
            // Risk directly on this hierarchy
            riscosProprios.push(riskInfo);
          } else if (isHierarchyGroup && !isFromSelf) {
            // Risk inherited from a parent hierarchy
            const key = originHierarchy.id;
            if (!riscosHerdadosHierarquia[key]) {
              riscosHerdadosHierarquia[key] = {
                origem: {
                  id: originHierarchy.id,
                  nome: origin.name,
                  tipo: HierarchyTypeTranslation[originHierarchy.type],
                  tipoOrigem: origin.type,
                },
                riscos: [],
              };
            }
            riscosHerdadosHierarquia[key].riscos.push(riskInfo);
          } else {
            // Risk from a homogeneous group (environment, workstation, etc.)
            const key = group.id;
            if (!riscosDeGrupos[key]) {
              riscosDeGrupos[key] = {
                origem: {
                  id: group.id,
                  nome: origin.name,
                  tipo: origin.type,
                  hierarquiaVinculada: {
                    id: originHierarchy.id,
                    nome: originHierarchy.name,
                    tipo: HierarchyTypeTranslation[originHierarchy.type],
                  },
                },
                riscos: [],
              };
            }
            riscosDeGrupos[key].riscos.push(riskInfo);
          }
        });
      });

      const result: any = {
        hierarquiaConsultada: {
          id: hierarchy.id,
          nome: hierarchy.name,
          tipo: HierarchyTypeTranslation[hierarchy.type],
          tipoEmIngles: hierarchy.type,
        },
        totalRiscos: allRisks.length,
        totalRiscosUnicos: risks.length,
        resumoPorTipo: Object.entries(
          allRisks.reduce(
            (acc, r) => {
              acc[r.tipo] = (acc[r.tipo] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          ),
        ).map(([tipo, quantidade]) => ({ tipo, quantidade })),
      };

      if (riscosProprios.length > 0) {
        result.riscosProprios = {
          descricao: 'Riscos vinculados diretamente a esta hierarquia',
          total: riscosProprios.length,
          riscos: riscosProprios,
        };
      }

      const herdados = Object.values(riscosHerdadosHierarquia);
      if (herdados.length > 0) {
        result.riscosHerdadosDaHierarquia = {
          descricao: 'Riscos herdados de hierarquias superiores (setor pai, diretoria, etc.)',
          total: herdados.reduce((sum, h) => sum + h.riscos.length, 0),
          origens: herdados,
        };
      }

      const grupos = Object.values(riscosDeGrupos);
      if (grupos.length > 0) {
        result.riscosDeGruposHomogeneos = {
          descricao: 'Riscos vindos de grupos homogêneos (ambientes, postos de trabalho, equipamentos, atividades)',
          total: grupos.reduce((sum, g) => sum + g.riscos.length, 0),
          origens: grupos,
        };
      }

      return JSON.stringify(result, null, 2);
    },
    {
      name: 'obter_riscos_hierarquia',
      description:
        'Obtém TODOS os riscos ocupacionais associados a uma hierarquia específica (cargo, setor, diretoria, etc.), incluindo riscos DIRETOS e HERDADOS. ' +
        'IMPORTANTE SOBRE COMO RISCOS SÃO VINCULADOS: Riscos podem ser vinculados de 3 formas: ' +
        '(1) DIRETAMENTE ao cargo/setor específico (retornados em "riscosProprios"), ' +
        '(2) Através da HIERARQUIA SUPERIOR - um cargo herda os riscos de seu setor pai, que herda os riscos de sua diretoria, e assim por diante (retornados em "riscosHerdadosDaHierarquia"), ' +
        '(3) Através de GRUPOS HOMOGÊNEOS (ambientes, postos de trabalho, equipamentos, atividades) que o cargo pertence (retornados em "riscosDeGruposHomogeneos"). ' +
        'O JSON de resposta organiza os riscos nessas 3 categorias, cada uma com sua descrição, total e lista agrupada por origem. ' +
        'DIFERENÇA COM obter_detalhes_hierarquia: A ferramenta obter_detalhes_hierarquia retorna informações gerais do cargo/setor E apenas riscos vinculados DIRETAMENTE. ' +
        'Esta ferramenta (obter_riscos_hierarquia) é ESPECÍFICA para riscos e retorna TODOS os riscos (diretos + herdados + de grupos homogêneos). ' +
        'QUANDO USAR: Use esta ferramenta quando o usuário perguntar especificamente sobre RISCOS, PERIGOS, EXPOSIÇÕES de um cargo/setor. ' +
        'Exemplos: "Quais riscos o cargo X está exposto?", "Liste todos os riscos do setor Y", "Que perigos afetam este cargo?". ' +
        'Use após buscar_hierarquias ou quando já souber o ID da hierarquia.',
      schema: z.object({
        _actionDescription: z.string().describe('Escreva uma breve descrição do que você está fazendo. DEVE ser no MESMO IDIOMA que o usuário está usando.'),
        hierarchyId: z.string().describe('ID da hierarquia obtido da ferramenta buscar_hierarquias'),
      }),
    },
  );

  const getRiskDataDetailsTool = tool(
    async ({ riskId, groupId, hierarchyId }) => {
      // Build where clause to find the specific RiskFactorData
      const where: any = {
        riskId: riskId,
        deletedAt: null,
      };

      // Add optional filters
      if (groupId) {
        where.homogeneousGroupId = groupId;
      }
      if (hierarchyId) {
        where.hierarchyId = hierarchyId;
      }

      const riskData = await prisma.riskFactorData.findFirst({
        where,
        select: {
          id: true,
          probability: true,
          probabilityAfter: true,
          exposure: true,
          level: true,
          json: true,
          activities: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          updatedAt: true,
          // Risk factor info
          riskFactor: {
            select: {
              id: true,
              name: true,
              type: true,
              severity: true,
              esocialCode: true,
              cas: true,
              appendix: true,
              symptoms: true,
              propagation: true,
            },
          },
          // Homogeneous group info
          homogeneousGroup: {
            select: {
              id: true,
              name: true,
              type: true,
              description: true,
              characterization: {
                select: {
                  name: true,
                  type: true,
                },
              },
              hierarchyOnHomogeneous: {
                select: {
                  hierarchy: {
                    select: {
                      id: true,
                      name: true,
                      type: true,
                    },
                  },
                },
              },
            },
          },
          // Hierarchy info
          hierarchy: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          // EPIs (Equipamentos de Proteção Individual)
          epiToRiskFactorData: {
            select: {
              epiId: true,
              efficientlyCheck: true,
              epcCheck: true,
              longPeriodsCheck: true,
              maintenanceCheck: true,
              sanitationCheck: true,
              tradeSignCheck: true,
              trainingCheck: true,
              unstoppedCheck: true,
              validationCheck: true,
              lifeTimeInDays: true,
              epi: {
                select: {
                  id: true,
                  ca: true,
                  description: true,
                  equipment: true,
                  observation: true,
                  restriction: true,
                  expiredDate: true,
                },
              },
            },
          },
          // Engineering controls (Medidas de Engenharia)
          engsToRiskFactorData: {
            select: {
              recMedId: true,
              efficientlyCheck: true,
              recMed: {
                select: {
                  id: true,
                  medName: true,
                  medType: true,
                  status: true,
                },
              },
            },
          },
          // Generate sources (Fontes Geradoras)
          generateSources: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
          // Administrative measures (Medidas Administrativas)
          adms: {
            select: {
              id: true,
              medName: true,
              medType: true,
              status: true,
            },
          },
          // Recommendations (Recomendações)
          recs: {
            select: {
              sequential_id: true,
              recMed: {
                select: {
                  id: true,
                  recName: true,
                  recType: true,
                  status: true,
                },
              },
            },
          },
        },
      });

      if (!riskData) {
        return JSON.stringify({
          erro: 'Dado de risco não encontrado',
          mensagem:
            'Nenhum RiskData encontrado para este riskId, ou não corresponde aos filtros fornecidos (groupId/hierarchyId). Verifique se o risco está vinculado ao grupo/hierarquia especificado.',
        });
      }

      // Calculate final probability: prioritize DB value, then quantitative, then qualitative
      const calculatedProbability = riskData.probability;
      const calculatedProbabilityAfter = riskData.probabilityAfter;

      // Build response object
      const result: any = {
        id: riskData.id,
        risco: {
          id: riskData.riskFactor.id,
          nome: riskData.riskFactor.name,
          tipo: riskData.riskFactor.type,
          severidade: riskData.riskFactor.severity,
          ...(riskData.riskFactor.esocialCode && { codigoESocial: riskData.riskFactor.esocialCode }),
          ...(riskData.riskFactor.cas && { cas: riskData.riskFactor.cas }),
          ...(riskData.riskFactor.appendix && { anexo: riskData.riskFactor.appendix }),
          ...(riskData.riskFactor.symptoms && { sintomas: riskData.riskFactor.symptoms }),
          ...(riskData.riskFactor.propagation && riskData.riskFactor.propagation.length > 0 && { propagacao: riskData.riskFactor.propagation }),
        },
        probabilidade: calculatedProbability,
        probabilidadeAposRecomendacoes: calculatedProbabilityAfter,
        exposicao: riskData.exposure,
        nivelRisco: riskData.level,
        dataInicio: riskData.startDate,
        dataFim: riskData.endDate,
      };

      // Add group info
      if (riskData.homogeneousGroup) {
        const group = riskData.homogeneousGroup;
        const isHierarchyGroup = group.type === HomoTypeEnum.HIERARCHY;
        const originHierarchy = group.hierarchyOnHomogeneous?.[0]?.hierarchy;

        const origin = getOriginHomogeneousGroup({
          name: group.name,
          type: group.type as HomoTypeEnum,
          characterization: group.characterization as { name: string; type: any } | null,
          hierarchy: isHierarchyGroup && originHierarchy ? { name: originHierarchy.name, type: originHierarchy.type as any } : null,
        });

        result.grupoHomogeneo = {
          id: group.id,
          nome: origin.name,
          tipo: origin.type,
          tipoOriginal: HomoTypeTranslation[group.type],
          tipoEmIngles: group.type,
          ...(group.description && { descricao: group.description }),
        };
      }

      // Add hierarchy info
      if (riskData.hierarchy) {
        result.hierarquia = {
          id: riskData.hierarchy.id,
          nome: riskData.hierarchy.name,
          tipo: HierarchyTypeTranslation[riskData.hierarchy.type],
          tipoEmIngles: riskData.hierarchy.type,
        };
      }

      // Add activities if present
      if (riskData.activities) {
        result.atividades = riskData.activities;
      }

      // Parse and add quantity data (quantitative measurements) using existing logic
      if (riskData.json) {
        const riskDataForMapper = {
          ...riskData,
          riskFactor: riskData.riskFactor,
          adms: [],
          recs: [],
          generateSources: [],
          engsToRiskFactorData: [],
          epiToRiskFactorData: [],
          examsToRiskFactorData: [],
          dataRecs: [],
        } as any;

        const quantityData = RiskDataMapper.quantityParse(riskDataForMapper);

        if (quantityData) {
          const dadosQuantitativos: any = {};

          // Noise (Ruído)
          if (quantityData.quantityNoise) {
            const noise = quantityData.quantityNoise;
            result.probabilidade = noise.probability;

            dadosQuantitativos.ruido = {
              tipo: 'RUÍDO',
              anexo: noise.appendix === '2' ? 'Anexo 2 - Ruído de Impacto' : 'Anexo 1 - Ruído Contínuo/Intermitente',
              medicoes: {
                ...(noise.ltcatq3 && { ltcatq3: `${noise.ltcatq3} dB` }),
                ...(noise.ltcatq5 && { ltcatq5: `${noise.ltcatq5} dB` }),
                ...(noise.nr15q5 && { nr15q5: `${noise.nr15q5} dB` }),
              },
            };
          }

          // Chemical (Químico)
          if (quantityData.quantityQui) {
            const qui = quantityData.quantityQui;
            result.probabilidade = qui.probability;

            dadosQuantitativos.quimico = {
              tipo: 'QUÍMICO',
              ...(qui.unit && { unidade: qui.unit }),
              ...(qui.manipulation && { manipulacao: qui.manipulation }),
              limites: {
                ...(qui.nr15lt && {
                  nr15lt: {
                    limite: qui.nr15lt,
                    valor: qui.nr15ltValue,
                    tipo: qui.isNr15Teto ? 'Valor Teto' : 'Limite de Tolerância',
                    probabilidade: qui.nr15ltProb,
                  },
                }),
                ...(qui.stel && {
                  stel: {
                    limite: qui.stel,
                    valor: qui.stelValue,
                    tipo: qui.isStelTeto ? 'ACGIH C (Ceiling)' : 'ACGIH TLV-STEL',
                    probabilidade: qui.stelProb,
                  },
                }),
                ...(qui.twa && {
                  twa: {
                    limite: qui.twa,
                    valor: qui.twaValue,
                    tipo: qui.isTwaTeto ? 'ACGIH C (Ceiling)' : 'ACGIH TLV-TWA',
                    probabilidade: qui.twaProb,
                  },
                }),
                ...(qui.vmp && {
                  vmp: {
                    limite: qui.vmp,
                    valor: qui.vmpValue,
                    tipo: qui.isVmpTeto ? 'Valor Teto' : 'Valor Máximo Permitido',
                    probabilidade: qui.vmpProb,
                  },
                }),
              },
              probabilidade: qui.probability,
            };
          }

          // Vibration Full Body (Vibração Corpo Inteiro)
          if (quantityData.quantityVibrationFB) {
            const vfb = quantityData.quantityVibrationFB;
            result.probabilidade = vfb.probability;

            dadosQuantitativos.vibracaoCorpoInteiro = {
              tipo: 'VIBRAÇÃO CORPO INTEIRO',
              medicoes: {
                ...(vfb.aren && { aren: `${vfb.aren} m/s²` }),
                ...(vfb.vdvr && { vdvr: `${vfb.vdvr} m/s^1.75` }),
              },
              probabilidade: vfb.probability,
            };
          }

          // Vibration Localized (Vibração Localizada - Mãos e Braços)
          if (quantityData.quantityVibrationL) {
            const vl = quantityData.quantityVibrationL;
            result.probabilidade = vl.probability;

            dadosQuantitativos.vibracaoLocalizada = {
              tipo: 'VIBRAÇÃO LOCALIZADA (MÃOS E BRAÇOS)',
              medicoes: {
                ...(vl.aren && { aren: `${vl.aren} m/s²` }),
              },
              probabilidade: vl.probability,
            };
          }

          // Radiation (Radiação)
          if (quantityData.quantityRadiation) {
            const rad = quantityData.quantityRadiation;
            result.probabilidade = rad.probability;

            dadosQuantitativos.radiacao = {
              tipo: 'RADIAÇÃO IONIZANTE',
              doses: {
                ...(rad.doseFB && { corpoInteiro: `${rad.doseFB} mSv`, probabilidade: rad.doseFBProb }),
                ...(rad.doseEye && { cristalino: `${rad.doseEye} mSv`, probabilidade: rad.doseEyeProb }),
                ...(rad.doseSkin && { pele: `${rad.doseSkin} mSv`, probabilidade: rad.doseSkinProb }),
                ...(rad.doseHand && { extremidades: `${rad.doseHand} mSv`, probabilidade: rad.doseHandProb }),
                ...(rad.doseFBPublic && { corpoInteiroPublico: `${rad.doseFBPublic} mSv`, probabilidade: rad.doseFBPublicProb }),
                ...(rad.doseEyePublic && { cristalinoPublico: `${rad.doseEyePublic} mSv`, probabilidade: rad.doseEyePublicProb }),
                ...(rad.doseSkinPublic && { pelePublico: `${rad.doseSkinPublic} mSv`, probabilidade: rad.doseSkinPublicProb }),
              },
              probabilidade: rad.probability,
            };
          }

          // Heat (Calor)
          if (quantityData.quantityHeat) {
            const heat = quantityData.quantityHeat;
            result.probabilidade = heat.probability;

            dadosQuantitativos.calor = {
              tipo: 'CALOR',
              medicoes: {
                ibtug: heat.ibtug,
                ...(heat.mw && { taxaMetabolica: `${heat.mw} W` }),
                aclimatizado: heat.isAcclimatized ? 'Sim' : 'Não',
              },
              limites: {
                ...(heat.ibtugNA && { nivelAcao: heat.ibtugNA }),
                ...(heat.ibtugLEO && { limiteExposicaoOcupacional: heat.ibtugLEO }),
                ...(heat.ibtugTETO && { valorTeto: heat.ibtugTETO }),
                ...(heat.ibtugLII && { limiteInadequacao: heat.ibtugLII }),
              },
              probabilidade: heat.probability,
            };
          }

          if (Object.keys(dadosQuantitativos).length > 0) {
            result.dadosQuantitativos = dadosQuantitativos;
          }
        }
      }

      // Add EPIs
      if (riskData.epiToRiskFactorData && riskData.epiToRiskFactorData.length > 0) {
        result.epis = {
          total: riskData.epiToRiskFactorData.length,
          lista: riskData.epiToRiskFactorData.map((epiData) => {
            // EPI is effective only if ALL checks are true
            const isEficaz =
              epiData.efficientlyCheck &&
              epiData.epcCheck &&
              epiData.longPeriodsCheck &&
              epiData.maintenanceCheck &&
              epiData.sanitationCheck &&
              epiData.tradeSignCheck &&
              epiData.trainingCheck &&
              epiData.unstoppedCheck &&
              epiData.validationCheck;

            return {
              epiId: epiData.epi.id,
              ca: epiData.epi.ca,
              descricao: epiData.epi.description,
              equipamento: epiData.epi.equipment,
              eficaz: isEficaz,
              ...(epiData.lifeTimeInDays && { tempoVidaDias: epiData.lifeTimeInDays }),
              ...(epiData.epi.observation && { observacao: epiData.epi.observation }),
              ...(epiData.epi.restriction && { restricao: epiData.epi.restriction }),
              ...(epiData.epi.expiredDate && { dataValidade: epiData.epi.expiredDate }),
            };
          }),
        };
      }

      // Add engineering measures
      if (riskData.engsToRiskFactorData && riskData.engsToRiskFactorData.length > 0) {
        result.medidasEngenharia = {
          total: riskData.engsToRiskFactorData.length,
          lista: riskData.engsToRiskFactorData.map((engData) => ({
            id: engData.recMed.id,
            nome: engData.recMed.medName,
            tipo: engData.recMed.medType,
            status: engData.recMed.status,
            eficaz: engData.efficientlyCheck,
          })),
        };
      }

      // Add generate sources
      if (riskData.generateSources && riskData.generateSources.length > 0) {
        result.fontesGeradoras = {
          total: riskData.generateSources.length,
          lista: riskData.generateSources.map((source) => ({
            id: source.id,
            nome: source.name,
            status: source.status,
          })),
        };
      }

      // Add administrative measures
      if (riskData.adms && riskData.adms.length > 0) {
        result.medidasAdministrativas = {
          total: riskData.adms.length,
          lista: riskData.adms.map((adm) => ({
            id: adm.id,
            nome: adm.medName,
            tipo: adm.medType,
            status: adm.status,
          })),
        };
      }

      // Add recommendations
      if (riskData.recs && riskData.recs.length > 0) {
        result.recomendacoes = {
          total: riskData.recs.length,
          lista: riskData.recs.map((rec) => ({
            id: rec.recMed.id,
            sequencial: rec.sequential_id,
            nome: rec.recMed.recName,
            tipo: rec.recMed.recType,
            status: rec.recMed.status,
          })),
        };
      }

      result.metadados = {
        dataCriacao: riskData.createdAt,
        dataAtualizacao: riskData.updatedAt,
      };

      return JSON.stringify(result, null, 2);
    },
    {
      name: 'obter_dados_completos_risco',
      description:
        'Obtém TODOS os dados completos de um RiskData (caracterização de risco) incluindo TODAS as suas relações: ' +
        'EPIs (Equipamentos de Proteção Individual), medidas de engenharia, medidas administrativas, fontes geradoras, recomendações, ' +
        'dados JSON personalizados, atividades, probabilidades, níveis de exposição, e todas as informações do risco associado. ' +
        'QUANDO USAR: Use esta ferramenta quando o usuário perguntar sobre DETALHES COMPLETOS de como um risco específico está caracterizado ' +
        'em um grupo homogêneo ou hierarquia, incluindo medidas de controle, EPIs recomendados, fontes geradoras, etc. ' +
        'Exemplos: "Quais EPIs são usados para o risco X no grupo Y?", "Me mostre todas as medidas de controle do risco Z", ' +
        '"Detalhe a caracterização completa do ruído no ambiente de produção". ' +
        'IMPORTANTE: Esta ferramenta busca por riskId (ID do RiskFactor genérico) e pode filtrar por grupo e hierarquia.',
      schema: z.object({
        _actionDescription: z.string().describe('Escreva uma breve descrição do que você está fazendo. DEVE ser no MESMO IDIOMA que o usuário está usando.'),
        riskId: z.string().uuid().describe('ID do RiskFactor (UUID) - este é o ID do risco genérico/fator de risco'),
        groupId: z.string().uuid().optional().describe('ID do grupo homogêneo (opcional) - use para filtrar que o RiskData pertence a este grupo específico'),
        hierarchyId: z.string().optional().describe('ID da hierarquia (opcional) - use para filtrar que o RiskData pertence a esta hierarquia específica'),
      }),
    },
  );

  return [
    searchRisksByTypeTool,
    getRiskDetailsTool,
    searchHomogeneousGroupsTool,
    getGroupDetailsTool,
    searchHierarchyTool,
    getHierarchyDetailsTool,
    getRisksByHierarchyTool,
    getRiskDataDetailsTool,
  ].map((t) => withErrorHandling(t));
}
