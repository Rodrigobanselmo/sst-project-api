import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { tool } from '@langchain/core/tools';
import type { PrismaClient } from '@prisma/client';
import Fuse from 'fuse.js';
import { z } from 'zod';
import { CharacterizationTypeTranslation, HierarchyTypeTranslation, HomoTypeTranslation } from '../../translations/characterization.translation';
import { withErrorHandling } from './tool-error-handler';

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

      const isPsic = riskTypes.includes('PSIC');
      // replcate PSIC with ERG
      const riskTypesWithErg = riskTypes.map((t) => t.replace('PSIC', 'ERG')) as any[];

      const risks = await prisma.riskFactors.findMany({
        where: {
          status: 'ACTIVE',
          deleted_at: null,
          companyId: targetCompanyId,
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
        // Configure Fuse.js for fuzzy search
        const fuse = new Fuse(allGroups, {
          keys: ['name', 'description'],
          threshold: 0.4, // 0 = exact match, 1 = match anything (0.4 is a good balance)
          includeScore: true,
          ignoreLocation: true, // Search anywhere in the string
          minMatchCharLength: 2,
        });

        // Perform fuzzy search
        const fuseResults = fuse.search(searchTerm);

        // Map results with score (Fuse.js score: 0 = perfect match, 1 = no match)
        // We invert it so higher score = better match
        results = fuseResults.map((result) => ({
          ...result.item,
          score: 1 - (result.score ?? 0),
        }));
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
          dica: 'Use a ferramenta obter_detalhes_grupo com o ID para ver informações completas (hierarquia, riscos, etc.). Use o parâmetro "page" para ver mais resultados.',
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
        // Configure Fuse.js for fuzzy search
        const fuse = new Fuse(allHierarchies, {
          keys: ['name'],
          threshold: 0.4, // 0 = exact match, 1 = match anything (0.4 is a good balance)
          includeScore: true,
          ignoreLocation: true, // Search anywhere in the string
          minMatchCharLength: 2,
        });

        // Perform fuzzy search
        const fuseResults = fuse.search(searchTerm);

        // Map results with score (Fuse.js score: 0 = perfect match, 1 = no match)
        // We invert it so higher score = better match
        results = fuseResults.map((result) => ({
          ...result.item,
          score: 1 - (result.score ?? 0),
        }));
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
        groupId: z.string().describe('ID do grupo homogêneo obtido da ferramenta buscar_grupos_homogeneos'),
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

      // Process risks and group by hierarchy origin
      const risksByOrigin: any = {};
      const allRisks: any[] = [];

      risks.forEach((risk) => {
        risk.riskFactorData.forEach((riskData) => {
          // Find which hierarchy this risk comes from
          const originHierarchy = riskData.homogeneousGroup.hierarchyOnHomogeneous[0]?.hierarchy;

          if (originHierarchy) {
            const originKey = originHierarchy.id;

            if (!risksByOrigin[originKey]) {
              risksByOrigin[originKey] = {
                hierarquia: {
                  id: originHierarchy.id,
                  nome: originHierarchy.name,
                  tipo: HierarchyTypeTranslation[originHierarchy.type],
                  tipoEmIngles: originHierarchy.type,
                },
                riscos: [],
              };
            }

            const riskInfo = {
              id: risk.id,
              nome: risk.name,
              tipo: RiskTypeTranslation[risk.type] || risk.type,
              tipoEmIngles: risk.type,
              severidade: risk.severity,
              codigoEsocial: risk.esocialCode,
              ...(risk.cas && { cas: risk.cas }),
              grupoHomogeneo: {
                id: riskData.homogeneousGroup.id,
                nome: riskData.homogeneousGroup.name,
                tipo: HomoTypeTranslation[riskData.homogeneousGroup.type],
              },
              nivelRisco: riskData.level,
              probabilidade: riskData.probability,
              ...(riskData.probabilityAfter && { probabilidadeApos: riskData.probabilityAfter }),
            };

            risksByOrigin[originKey].riscos.push(riskInfo);
            allRisks.push(riskInfo);
          }
        });
      });

      const result = {
        hierarquiaConsultada: {
          id: hierarchy.id,
          nome: hierarchy.name,
          tipo: HierarchyTypeTranslation[hierarchy.type],
          tipoEmIngles: hierarchy.type,
        },
        totalRiscos: allRisks.length,
        totalRiscosUnicos: risks.length,
        riscosPorOrigem: Object.values(risksByOrigin),
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

      return JSON.stringify(result, null, 2);
    },
    {
      name: 'obter_riscos_hierarquia',
      description:
        'Obtém TODOS os riscos ocupacionais associados a uma hierarquia específica (cargo, setor, diretoria, etc.), incluindo riscos DIRETOS e HERDADOS. ' +
        'IMPORTANTE SOBRE COMO RISCOS SÃO VINCULADOS: Riscos podem ser vinculados de 3 formas: ' +
        '(1) DIRETAMENTE ao cargo/setor específico, ' +
        '(2) Através de GRUPOS HOMOGÊNEOS (ambientes, postos de trabalho, equipamentos, atividades) que o cargo pertence, ' +
        '(3) Através da HIERARQUIA SUPERIOR - um cargo herda os riscos de seu setor pai, que herda os riscos de sua diretoria, e assim por diante. ' +
        'Esta ferramenta retorna TODOS os riscos das 3 formas acima, mostrando a ORIGEM de cada risco (de qual hierarquia ou grupo homogêneo o risco vem). ' +
        'DIFERENÇA COM obter_detalhes_hierarquia: A ferramenta obter_detalhes_hierarquia retorna informações gerais do cargo/setor E apenas riscos vinculados DIRETAMENTE. ' +
        'Esta ferramenta (obter_riscos_hierarquia) é ESPECÍFICA para riscos e retorna TODOS os riscos (diretos + herdados + de grupos homogêneos). ' +
        'QUANDO USAR: Use esta ferramenta quando o usuário perguntar especificamente sobre RISCOS, PERIGOS, EXPOSIÇÕES de um cargo/setor. ' +
        'Exemplos: "Quais riscos o cargo X está exposto?", "Liste todos os riscos do setor Y", "Que perigos afetam este cargo?". ' +
        'Retorna informações detalhadas incluindo: nome do risco, tipo (Físico, Químico, Biológico, Ergonômico, Acidente), severidade, nível de risco, probabilidade, grupo homogêneo associado e origem (de qual hierarquia o risco vem). ' +
        'Use após buscar_hierarquias ou quando já souber o ID da hierarquia.',
      schema: z.object({
        _actionDescription: z.string().describe('Escreva uma breve descrição do que você está fazendo. DEVE ser no MESMO IDIOMA que o usuário está usando.'),
        hierarchyId: z.string().describe('ID da hierarquia obtido da ferramenta buscar_hierarquias'),
      }),
    },
  );

  return [searchRisksByTypeTool, getRiskDetailsTool, searchHomogeneousGroupsTool, getGroupDetailsTool, searchHierarchyTool, getHierarchyDetailsTool, getRisksByHierarchyTool].map((t) =>
    withErrorHandling(t),
  );
}
