import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AiAdapter } from '@/@v2/shared/adapters/ai/ai.interface';
import { AiContentBuilders } from '@/@v2/shared/adapters/ai/helpers/content-builders';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { CacheProvider } from '@/shared/providers/CacheProvider/CacheProvider';
import { CacheTtlEnum } from '@/shared/interfaces/cache.types';
import { CacheEnum } from '@/shared/constants/enum/cache';
import { IAiAnalyzeCharacterizationUseCase } from './ai-analyze-characterization.types';

@Injectable()
export class AiAnalyzeCharacterizationUseCase {
  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    private readonly prisma: PrismaServiceV2,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(params: IAiAnalyzeCharacterizationUseCase.Params): Promise<IAiAnalyzeCharacterizationUseCase.Result> {
    // Fetch the characterization data and available risks in parallel
    const [characterization, availableRisks] = await Promise.all([
      this.prisma.companyCharacterization.findFirst({
        where: {
          id: params.characterizationId,
          companyId: params.companyId,
          workspaceId: params.workspaceId,
        },
        include: {
          photos: {
            where: { deleted_at: null },
            select: {
              id: true,
              photoUrl: true,
              name: true,
            },
          },
          homogeneousGroup: {
            include: {
              riskFactorData: {
                where: { deletedAt: null },
                include: {
                  riskFactor: {
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
      }),
      // Get cached available risks from the company's risk database
      this.getCachedAvailableRisks(params.companyId),
    ]);

    if (!characterization) {
      throw new NotFoundException('Characterization not found');
    }

    // Create ID mapping for risks (UUID -> integer)
    const riskIdMapping = this.createRiskIdMapping(availableRisks);

    // Build the content for AI analysis including available risks
    const content = this.buildCharacterizationContent(characterization, availableRisks, riskIdMapping);

    // Create the analysis prompt
    const prompt = this.getDefaultPrompt(params.customPrompt);

    try {
      // Call the AI adapter to analyze the characterization
      const result = await this.aiAdapter.analyze({
        content,
        prompt,
        language: 'pt-BR',
        responseFormat: {
          type: 'json_schema',
          json_schema: {
            name: 'risk_analysis',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                riscos: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id_risco: { type: 'number' },
                      explicacao: { type: 'string' },
                      fonteGeradora: { type: 'string' },
                      probabilidade: { type: 'number', minimum: 1, maximum: 5 },
                      controlesExistentes: { type: 'string' },
                      medidasEngenharia: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      medidasAdministrativas: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      confianca: { type: 'number', minimum: 0, maximum: 1 },
                    },
                    required: ['id_risco', 'explicacao', 'fonteGeradora', 'probabilidade', 'controlesExistentes', 'medidasEngenharia', 'medidasAdministrativas', 'confianca'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['riscos'],
              additionalProperties: false,
            },
          },
        },
        systemPrompt: 'Você é um especialista em SST (Segurança e Saúde no Trabalho). Analise a caracterização e identifique riscos usando APENAS os IDs fornecidos na base de conhecimento.',
        model: params.model, // Pass the optional model parameter
      });

      console.log(JSON.stringify({ prompt, content, result }));

      // Parse the structured JSON response and map integer IDs back to UUIDs
      const { recommendedRiskIds, detailedRisks } = this.parseStructuredResponse(result.analysis, riskIdMapping.intToUuid, availableRisks);

      return {
        analysis: result.analysis,
        confidence: result.confidence,
        recommendedRisks: recommendedRiskIds,
        detailedRisks: detailedRisks,
        metadata: {
          ...result.metadata,
          companyId: params.companyId,
          workspaceId: params.workspaceId,
          characterizationId: params.characterizationId,
          timestamp: new Date().toISOString(),
          totalAvailableRisks: availableRisks.length,
          recommendedRisksCount: recommendedRiskIds.length,
        },
        characterization: {
          id: characterization.id,
          name: characterization.name,
          type: characterization.type,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to analyze characterization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createRiskIdMapping(risks: IAiAnalyzeCharacterizationUseCase.AvailableRisk[]): { uuidToInt: Map<string, number>; intToUuid: Map<number, string> } {
    const uuidToInt = new Map<string, number>();
    const intToUuid = new Map<number, string>();

    risks.forEach((risk, index) => {
      const intId = index + 1; // Start from 1
      uuidToInt.set(risk.id, intId);
      intToUuid.set(intId, risk.id);
    });

    return { uuidToInt, intToUuid };
  }

  private buildCharacterizationContent(
    characterization: IAiAnalyzeCharacterizationUseCase.CharacterizationData,
    availableRisks: IAiAnalyzeCharacterizationUseCase.AvailableRisk[],
    riskIdMapping: { uuidToInt: Map<string, number>; intToUuid: Map<number, string> },
  ) {
    const textContent = [];

    // Basic information
    textContent.push(`Nome: ${characterization.name}`);
    if (characterization.description) {
      textContent.push(`Descrição: ${characterization.description}`);
    }
    textContent.push(`Tipo: ${characterization.type}`);

    // Activities
    if (characterization.activities && characterization.activities.length > 0) {
      textContent.push(`Atividades: ${characterization.activities.join(', ')}`);
    }

    // Considerations
    if (characterization.considerations && characterization.considerations.length > 0) {
      textContent.push(`Considerações: ${characterization.considerations.join(', ')}`);
    }

    // Paragraphs
    if (characterization.paragraphs && characterization.paragraphs.length > 0) {
      textContent.push(`Parágrafos: ${characterization.paragraphs.join(', ')}`);
    }

    // Environmental data
    const environmentalData = [];
    if (characterization.temperature) environmentalData.push(`Temperatura: ${characterization.temperature}`);
    if (characterization.noiseValue) environmentalData.push(`Ruído: ${characterization.noiseValue}`);
    if (characterization.luminosity) environmentalData.push(`Luminosidade: ${characterization.luminosity}`);
    if (characterization.moisturePercentage) environmentalData.push(`Umidade: ${characterization.moisturePercentage}`);

    if (environmentalData.length > 0) {
      textContent.push(`Dados Ambientais: ${environmentalData.join(', ')}`);
    }

    // Build content array with cacheable risks knowledge base and characterization data
    const content = [];

    // Add cacheable risks knowledge base first (this will be cached by OpenAI)
    const risksByType = this.groupRisksByType(availableRisks);
    const risksText = this.formatRisksForAI(risksByType, riskIdMapping.uuidToInt);
    content.push(AiContentBuilders.text(`Base de Conhecimento de Riscos Disponíveis:\n${risksText}`, { cacheable: true })); // cacheable = true

    // Add characterization-specific content (not cached)
    content.push(AiContentBuilders.text(textContent.join('\n\n')));

    // Add photos if available
    if (characterization.photos && characterization.photos.length > 0) {
      const photoUrls = characterization.photos.map((photo: IAiAnalyzeCharacterizationUseCase.CharacterizationPhoto) => photo.photoUrl).filter(Boolean);

      if (photoUrls.length > 0) {
        content.push(...AiContentBuilders.images(photoUrls));
      }
    }

    return content;
  }

  private groupRisksByType(risks: IAiAnalyzeCharacterizationUseCase.AvailableRisk[]): Record<string, IAiAnalyzeCharacterizationUseCase.AvailableRisk[]> {
    const riskTypeLabels = {
      FIS: 'Físicos',
      QUI: 'Químicos',
      BIO: 'Biológicos',
      ERG: 'Ergonômicos',
      ACI: 'Acidentes',
      OUTROS: 'Outros',
    };

    return risks.reduce((groups: Record<string, IAiAnalyzeCharacterizationUseCase.AvailableRisk[]>, risk) => {
      const typeLabel = riskTypeLabels[risk.type as keyof typeof riskTypeLabels] || risk.type;
      if (!groups[typeLabel]) {
        groups[typeLabel] = [];
      }
      groups[typeLabel].push(risk);
      return groups;
    }, {});
  }

  private formatRisksForAI(risksByType: Record<string, IAiAnalyzeCharacterizationUseCase.AvailableRisk[]>, uuidToIntMapping: Map<string, number>): string {
    let risksText = '';

    Object.entries(risksByType).forEach(([type, risks]: [string, IAiAnalyzeCharacterizationUseCase.AvailableRisk[]]) => {
      risksText += `\n${type}:\n`;
      risks.forEach((risk) => {
        const intId = uuidToIntMapping.get(risk.id);
        risksText += `${intId}: ${risk.name}\n`;
      });
    });

    return risksText;
  }

  private getDefaultPrompt(customPrompt?: string): string {
    let prompt = '';

    // Add custom prompt as user input at the beginning if provided
    if (customPrompt) {
      prompt += `ENTRADA DO USUÁRIO:\n${customPrompt}\n\n`;
    }

    // Add the default prompt instructions
    prompt += `Identifique nessa imagem os principais Perigos ou Fatores de Riscos Ocupacionais (P/FRO), com suas respectivas Probabilidades, fontes geradoras, controles existentes (se houver) e as recomendações para mitigação.

Use APENAS os IDs da "Base de Conhecimento de Riscos Disponíveis".

INSTRUÇÕES:
- Use SOMENTE os IDs fornecidos na base de conhecimento
- Seja conservador: prefira não identificar um risco do que identificar incorretamente
- Para cada risco identificado, explique por que foi identificado
- Descreva a fonte geradora do risco (o que origina o risco no ambiente)
- Avalie a probabilidade do risco de 1 a 5 (chance de um dano ocorrer ou frequência de exposição)
- Identifique controles existentes no ambiente (se houver)
- Recomende medidas de controle separadas em engenharia e administrativas
- Avalie sua confiança de 0 a 1 para cada identificação

ORIENTAÇÕES ESPECÍFICAS:
- fonteGeradora: descreva o que origina o risco (ex: "máquina gerando ruído", "postura inadequada na atividade", "fiação exposta")
- probabilidade: escala de 1 a 5 representando a chance de dano ocorrer (1=muito baixa, 5=muito alta)
- controlesExistentes: descreva controles já implementados no ambiente
- medidasEngenharia: modificações no local/equipamento para isolar/remover perigo
- medidasAdministrativas: organização do trabalho para reduzir exposição
- confianca: seja realista na avaliação (0.7-0.9 para riscos claros, 0.5-0.7 para riscos prováveis)`;

    return prompt;
  }

  private parseStructuredResponse(
    aiResponse: string,
    intToUuidMapping: Map<number, string>,
    availableRisks: IAiAnalyzeCharacterizationUseCase.AvailableRisk[],
  ): {
    recommendedRiskIds: string[];
    detailedRisks: IAiAnalyzeCharacterizationUseCase.DetailedRisk[];
  } {
    const recommendedRiskIds: string[] = [];
    const detailedRisks: IAiAnalyzeCharacterizationUseCase.DetailedRisk[] = [];

    try {
      // Parse the structured JSON response
      const jsonResponse: IAiAnalyzeCharacterizationUseCase.AiJsonResponse = JSON.parse(aiResponse);

      if (jsonResponse.riscos && Array.isArray(jsonResponse.riscos)) {
        jsonResponse.riscos.forEach((risco: IAiAnalyzeCharacterizationUseCase.AiRiskResponse) => {
          if (risco.id_risco) {
            const intId = parseInt(risco.id_risco.toString(), 10);
            const uuid = intToUuidMapping.get(intId);

            if (uuid) {
              // Find the risk details from availableRisks
              const riskDetails = availableRisks.find((r) => r.id === uuid);

              // Only include if risk is found in the database
              if (riskDetails) {
                recommendedRiskIds.push(uuid);

                detailedRisks.push({
                  id: uuid,
                  name: riskDetails.name,
                  type: riskDetails.type,
                  explanation: risco.explicacao || '',
                  generateSource: risco.fonteGeradora || '',
                  probability: risco.probabilidade || 0,
                  existingControls: risco.controlesExistentes || '',
                  engineeringMeasures: risco.medidasEngenharia || [],
                  administrativeMeasures: risco.medidasAdministrativas || [],
                  confidence: risco.confianca || 0,
                });
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to parse structured response:', error);
      // If parsing fails, return empty arrays
    }

    return { recommendedRiskIds, detailedRisks };
  }

  /**
   * Get cached available risks for a company
   * This method caches the risks knowledge base to improve performance and reduce costs
   */
  private async getCachedAvailableRisks(companyId: string): Promise<IAiAnalyzeCharacterizationUseCase.AvailableRisk[]> {
    const cache = new CacheProvider({
      cacheManager: this.cacheManager,
      ttlSeconds: CacheTtlEnum.MIN_10,
    });

    const cacheKey = `${CacheEnum.AI_RISKS_KNOWLEDGE_BASE}_${companyId}`;

    return cache.funcResponse(
      () =>
        this.prisma.riskFactors.findMany({
          where: {
            OR: [{ companyId }, { system: true }],
            status: 'ACTIVE',
            deleted_at: null,
            type: { notIn: ['OUTROS', 'QUI'] },
          },
          select: {
            id: true,
            name: true,
            type: true,
          },
          orderBy: [{ type: 'asc' }, { severity: 'desc' }, { name: 'asc' }],
          take: 500, // Much higher limit since we're only sending id, name, type
        }),
      cacheKey,
    );
  }
}
