import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AiAdapter } from '@/@v2/shared/adapters/ai/ai.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { CacheProvider } from '@/shared/providers/CacheProvider/CacheProvider';
import { CacheTtlEnum } from '@/shared/interfaces/cache.types';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { IAiAnalyzeFormQuestionsRisksUseCase } from './ai-analyze-form-questions-risks.types';
import { FormQuestionsAnswersRisksService } from '../../shared/services/form-questions-answers-risks.service';
import { IFormQuestionsAnswersRisksService } from '../../shared/services/form-questions-answers-risks.types';
import { AiRiskAnalysisResponse } from '@/@v2/shared/types/ai-risk-analysis-response.types';
import { FormAiAnalysisStatusEnum } from '@prisma/client';

@Injectable()
export class AiAnalyzeFormQuestionsRisksUseCase {
  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    private readonly prisma: PrismaServiceV2,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly formQuestionsAnswersRisksService: FormQuestionsAnswersRisksService,
  ) {}

  async execute(params: IAiAnalyzeFormQuestionsRisksUseCase.Params): Promise<IAiAnalyzeFormQuestionsRisksUseCase.Result> {
    // Validate input parameters
    this.validateParams(params);

    const startTime = Date.now();
    let formData: IFormQuestionsAnswersRisksService.Result;
    let availableRisks: IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData[];

    try {
      // Get form questions and answers data by hierarchy and risk with detailed question information
      formData = await this.formQuestionsAnswersRisksService.getFormQuestionsAnswersRisks({
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
      });

      // Get available risks with their generateSources and recommendations
      availableRisks = await this.getCachedAvailableRisks(params.companyId);

      console.log(`[AI Analysis] Found ${Object.keys(formData.hierarchyRiskMap).length} hierarchies and ${Object.keys(formData.riskMap).length} risks for company ${params.companyId}`);
    } catch (error) {
      console.error('[AI Analysis] Failed to fetch form data or available risks:', error);
      throw new BadRequestException(`Failed to fetch required data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Transform the data into hierarchy-risk combinations for analysis
    const hierarchyRiskData = this.transformToHierarchyRiskData(formData, availableRisks);

    if (hierarchyRiskData.length === 0) {
      console.warn('[AI Analysis] No risk data found for analysis', {
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
        hierarchiesCount: Object.keys(formData.hierarchyRiskMap).length,
        risksCount: Object.keys(formData.riskMap).length,
        availableRisksCount: availableRisks.length,
      });
      throw new BadRequestException('No risk data found for analysis. Please ensure the form has responses and risks are properly configured.');
    }

    // Filter only the pairs that are eligible to be analyzed by the AI.
    // Skippable pairs (no questions, zero probability, missing risk metadata) used to
    // create PROCESSING records that were never resolved — they would stay forever as
    // PROCESSING. We now exclude them upfront so every PROCESSING record will reach a
    // final state (DONE or FAILED).
    // NRO (Nível de Risco Ocupacional) thresholds — values returned by getMatrizRisk:
    // 0=N/A, 1=MuitoBaixo, 2=Baixo, 3=Moderado, 4=Alto, 5=MuitoAlto, 6=Interromper.
    // Pairs below this level are not worth the AI cost.
    const MIN_OCCUPATIONAL_RISK_LEVEL = 3;

    const availableRisksMap = new Map(availableRisks.map((risk) => [risk.id, risk]));
    const eligibleHierarchyRiskData = hierarchyRiskData.filter((item) => {
      const risk = availableRisksMap.get(item.riskId);
      if (!risk) return false;
      if (item.questions.length === 0) return false;
      if (item.probability === 0) return false;

      const nro = getMatrizRisk(risk.severity, item.probability);
      if (nro < MIN_OCCUPATIONAL_RISK_LEVEL) return false;

      return true;
    });
    const skippedCount = hierarchyRiskData.length - eligibleHierarchyRiskData.length;

    if (eligibleHierarchyRiskData.length === 0) {
      console.warn('[AI Analysis] No eligible hierarchy-risk combinations to analyze', {
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
        totalCombinations: hierarchyRiskData.length,
      });
      throw new BadRequestException('No eligible risk data for analysis. Ensure the form has answered questions with non-zero probability.');
    }

    console.log(`[AI Analysis] Eligible: ${eligibleHierarchyRiskData.length} / Skipped: ${skippedCount} / Total: ${hierarchyRiskData.length}`);

    // Create processing records in database to track status — only for eligible pairs.
    try {
      await this.createProcessingRecords(eligibleHierarchyRiskData, params);
      console.log(`[AI Analysis] Created processing records for ${eligibleHierarchyRiskData.length} analyses`);
    } catch (error) {
      console.error('[AI Analysis] Failed to create processing records:', error);
      throw new BadRequestException(`Failed to create processing records: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Fire-and-forget: run the heavy AI batch in the background so the HTTP response
    // returns immediately. The client polls FormAiAnalysis records by status and will
    // pick up DONE/FAILED as the background work progresses.
    void this.runAnalysesInBackground(eligibleHierarchyRiskData, availableRisks, params).catch((error) => {
      console.error('[AI Analysis] Background runner unhandled rejection:', error);
    });

    return {
      analyses: [],
      totalHierarchies: new Set(eligibleHierarchyRiskData.map((hr) => hr.hierarchyId)).size,
      totalRisks: new Set(eligibleHierarchyRiskData.map((hr) => hr.riskId)).size,
      totalAnalyses: 0,
      metadata: {
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
        timestamp: new Date().toISOString(),
        model: params.model,
        processingTimeMs: Date.now() - startTime,
      },
    };
  }

  private async runAnalysesInBackground(
    eligibleHierarchyRiskData: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[],
    availableRisks: IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData[],
    params: IAiAnalyzeFormQuestionsRisksUseCase.Params,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      const analyses = await asyncBatch({
        items: eligibleHierarchyRiskData,
        batchSize: 10,
        callback: async (hierarchyRisk, batchIndex, chunkIndex) => {
          console.log(`[AI Analysis] Processing batch ${batchIndex}, chunk ${chunkIndex}: ${hierarchyRisk.hierarchyName} - ${hierarchyRisk.riskName}`);
          try {
            return await this.analyzeHierarchyRisk(hierarchyRisk, availableRisks, params);
          } catch (error) {
            console.error(`[AI Analysis] Failed to analyze ${hierarchyRisk.hierarchyName} - ${hierarchyRisk.riskName}:`, error);
            return {
              hierarchyId: hierarchyRisk.hierarchyId,
              riskId: hierarchyRisk.riskId,
              error: error instanceof Error ? error.message : 'Unknown error',
              failed: true as const,
            };
          }
        },
      });

      const successfulAnalyses = analyses.filter((analysis): analysis is IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskAnalysis => !!analysis && !('failed' in analysis));
      const failedAnalysesData = analyses.filter((analysis): analysis is { hierarchyId: string; riskId: string; error: string; failed: true } => !!analysis && 'failed' in analysis);

      const processingTimeMs = Date.now() - startTime;
      console.log(`[AI Analysis] Background completed in ${processingTimeMs}ms. Successful: ${successfulAnalyses.length}, Failed: ${failedAnalysesData.length}`);

      if (successfulAnalyses.length > 0) {
        try {
          await this.storeAnalysesToDatabase(successfulAnalyses, params, processingTimeMs);
        } catch (error) {
          console.error('[AI Analysis] Failed to store analyses to database:', error);
        }
      }

      if (failedAnalysesData.length > 0) {
        try {
          await this.storeFailedAnalysesToDatabase(failedAnalysesData, params);
        } catch (error) {
          console.error('[AI Analysis] Failed to store failed analyses to database:', error);
        }
      }

      // Safety net: ensure no PROCESSING record is left orphaned. Any eligible pair
      // that did not produce a result is marked as FAILED so the UI/polling can stop.
      const resolvedKeys = new Set<string>([...successfulAnalyses.map((a) => `${a.hierarchyId}:${a.riskId}`), ...failedAnalysesData.map((a) => `${a.hierarchyId}:${a.riskId}`)]);
      const orphanData = eligibleHierarchyRiskData.filter((hr) => !resolvedKeys.has(`${hr.hierarchyId}:${hr.riskId}`));
      if (orphanData.length > 0) {
        console.warn(`[AI Analysis] ${orphanData.length} orphan PROCESSING records detected, marking as FAILED`);
        try {
          await this.storeFailedAnalysesToDatabase(
            orphanData.map((hr) => ({
              hierarchyId: hr.hierarchyId,
              riskId: hr.riskId,
              error: 'Analysis returned no result',
            })),
            params,
          );
        } catch (error) {
          console.error('[AI Analysis] Failed to mark orphan analyses as FAILED:', error);
        }
      }
    } catch (error) {
      // Catastrophic batch failure — mark every in-flight PROCESSING record as FAILED so
      // the UI does not stay stuck in PROCESSING.
      console.error('[AI Analysis] Catastrophic background error, marking all eligible records as FAILED:', error);
      try {
        await this.storeFailedAnalysesToDatabase(
          eligibleHierarchyRiskData.map((hr) => ({
            hierarchyId: hr.hierarchyId,
            riskId: hr.riskId,
            error: error instanceof Error ? error.message : 'Unknown background error',
          })),
          params,
        );
      } catch (storageError) {
        console.error('[AI Analysis] Failed to mark records as FAILED after catastrophic error:', storageError);
      }
    }
  }

  private async storeAnalysesToDatabase(
    analyses: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskAnalysis[],
    params: IAiAnalyzeFormQuestionsRisksUseCase.Params,
    processingTimeMs: number,
  ): Promise<void> {
    const analysisData = analyses.map((analysis) => ({
      companyId: params.companyId,
      formApplicationId: params.formApplicationId,
      hierarchyId: analysis.hierarchyId,
      riskId: analysis.riskId,
      status: FormAiAnalysisStatusEnum.DONE,
      probability: analysis.probability,
      confidence: analysis.confidence,
      analysis: analysis.analysis as any, // Store the AI response as JSON
      metadata: analysis.metadata || {},
      model: params.model,
      processingTimeMs,
    }));

    // Use upsert to handle potential duplicates (same formApplicationId, hierarchyId, riskId)
    await Promise.all(
      analysisData.map((data) =>
        this.prisma.formAiAnalysis.upsert({
          where: {
            formApplicationId_hierarchyId_riskId: {
              formApplicationId: data.formApplicationId,
              hierarchyId: data.hierarchyId,
              riskId: data.riskId,
            },
          },
          update: {
            status: data.status,
            probability: data.probability,
            confidence: data.confidence,
            analysis: data.analysis,
            metadata: data.metadata,
            model: data.model,
            processingTimeMs: data.processingTimeMs,
            updated_at: new Date(),
          },
          create: data,
        }),
      ),
    );
  }

  private async storeFailedAnalysesToDatabase(failedAnalyses: Array<{ hierarchyId: string; riskId: string; error: string }>, params: IAiAnalyzeFormQuestionsRisksUseCase.Params): Promise<void> {
    if (failedAnalyses.length === 0) return;

    const failedData = failedAnalyses.map((failed) => ({
      companyId: params.companyId,
      formApplicationId: params.formApplicationId,
      hierarchyId: failed.hierarchyId,
      riskId: failed.riskId,
      status: FormAiAnalysisStatusEnum.FAILED,
      probability: null,
      confidence: null,
      analysis: null,
      metadata: { error: failed.error },
      model: params.model,
      processingTimeMs: null,
    }));

    // Use upsert to handle potential duplicates
    await Promise.all(
      failedData.map((data) =>
        this.prisma.formAiAnalysis.upsert({
          where: {
            formApplicationId_hierarchyId_riskId: {
              formApplicationId: data.formApplicationId,
              hierarchyId: data.hierarchyId,
              riskId: data.riskId,
            },
          },
          update: {
            status: data.status,
            metadata: data.metadata,
            updated_at: new Date(),
          },
          create: data,
        }),
      ),
    );
  }

  private async createProcessingRecords(hierarchyRiskData: Array<{ hierarchyId: string; riskId: string }>, params: IAiAnalyzeFormQuestionsRisksUseCase.Params): Promise<void> {
    const processingData = hierarchyRiskData.map((hr) => ({
      companyId: params.companyId,
      formApplicationId: params.formApplicationId,
      hierarchyId: hr.hierarchyId,
      riskId: hr.riskId,
      status: FormAiAnalysisStatusEnum.PROCESSING,
      probability: null,
      confidence: null,
      analysis: null,
      metadata: { startedAt: new Date().toISOString() },
      model: params.model,
      processingTimeMs: null,
    }));

    // Use upsert to handle potential existing records
    await Promise.all(
      processingData.map((data) =>
        this.prisma.formAiAnalysis.upsert({
          where: {
            formApplicationId_hierarchyId_riskId: {
              formApplicationId: data.formApplicationId,
              hierarchyId: data.hierarchyId,
              riskId: data.riskId,
            },
          },
          update: {
            status: data.status,
            metadata: data.metadata,
            model: data.model,
            updated_at: new Date(),
          },
          create: data,
        }),
      ),
    );
  }

  private validateParams(params: IAiAnalyzeFormQuestionsRisksUseCase.Params): void {
    if (!params.companyId || typeof params.companyId !== 'string') {
      throw new BadRequestException('companyId is required and must be a string');
    }

    if (!params.formApplicationId || typeof params.formApplicationId !== 'string') {
      throw new BadRequestException('formApplicationId is required and must be a string');
    }

    if (params.model && typeof params.model !== 'string') {
      throw new BadRequestException('model must be a string if provided');
    }

    if (params.customPrompt && typeof params.customPrompt !== 'string') {
      throw new BadRequestException('customPrompt must be a string if provided');
    }
  }

  private transformToHierarchyRiskData(
    formData: IFormQuestionsAnswersRisksService.Result,
    availableRisks: IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData[],
  ): IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[] {
    const hierarchyRiskData: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[] = [];
    const availableRisksMap = new Map(availableRisks.map((risk) => [risk.id, risk]));

    // Iterate through each hierarchy using the new detailed data structure
    Object.entries(formData.hierarchyRiskMap).forEach(([hierarchyId, risks]) => {
      const hierarchy = formData.hierarchyMap[hierarchyId];
      if (!hierarchy) return;

      // Iterate through each risk in this hierarchy
      Object.entries(risks).forEach(([riskId, riskSummary]) => {
        const risk = formData.riskMap[riskId];
        const availableRisk = availableRisksMap.get(riskId);

        if (!risk || !availableRisk) return;

        // Transform question summaries into detailed question data for AI analysis
        const questions: IAiAnalyzeFormQuestionsRisksUseCase.QuestionData[] = riskSummary.questions.map((questionSummary) => ({
          id: questionSummary.questionId,
          text: questionSummary.questionText,
          probability: questionSummary.averageValue ? Math.ceil(questionSummary.averageValue) : 0,
          values: questionSummary.values,
        }));

        // If no individual questions, create a summary question
        if (questions.length === 0 && riskSummary.values.length > 0) {
          questions.push({
            id: `${hierarchyId}-${riskId}-summary`,
            text: `Perguntas relacionadas ao risco ${risk.name}`,
            probability: riskSummary.probability,
            values: riskSummary.values,
          });
        }

        hierarchyRiskData.push({
          hierarchyId,
          hierarchyName: hierarchy.name,
          hierarchyType: hierarchy.type,
          riskId,
          riskName: risk.name,
          riskType: risk.type,
          probability: riskSummary.probability,
          questions,
        });
      });
    });

    return hierarchyRiskData;
  }

  private async analyzeHierarchyRisk(
    hierarchyRisk: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData,
    availableRisks: IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData[],
    params: IAiAnalyzeFormQuestionsRisksUseCase.Params,
  ): Promise<IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskAnalysis> {
    const analysisId = `${hierarchyRisk.hierarchyName}-${hierarchyRisk.riskName}`;

    // Skippable cases are filtered upfront in execute(). These defensive throws ensure
    // that if a skippable case ever reaches here, it is propagated as a FAILED record
    // instead of producing a silent null that would leave a PROCESSING orphan.
    try {
      const riskData = availableRisks.find((risk) => risk.id === hierarchyRisk.riskId);
      if (!riskData) {
        throw new Error(`Risk data not found for risk ID: ${hierarchyRisk.riskId}`);
      }
      if (hierarchyRisk.questions.length === 0) {
        throw new Error(`No questions found for analysis: ${analysisId}`);
      }
      if (hierarchyRisk.probability === 0) {
        throw new Error(`Zero probability for analysis: ${analysisId}`);
      }

      console.log(`[AI Analysis] Starting analysis for: ${analysisId} (probability: ${hierarchyRisk.probability})`);

      // Build content for AI analysis
      const content = this.buildAnalysisContent(hierarchyRisk, riskData);

      // Create the analysis prompt
      const prompt = this.getAnalysisPrompt(params.customPrompt);

      // Call the AI adapter with timeout handling
      const result = await Promise.race([
        this.aiAdapter.analyze({
          content,
          prompt,
          language: 'pt-BR',
          responseFormat: {
            type: 'json_schema',
            json_schema: {
              name: 'psychosocial_risk_analysis',
              strict: true,
              schema: this.getResponseSchema(),
            },
          },
          systemPrompt:
            'Você é um assistente técnico integrado ao SimpleSST, responsável exclusivamente por sugerir Fontes Geradoras e Recomendações para os Fatores de Riscos Psicossociais (FRPS) dentro do PGR.',
          model: params.model,
        }),
        new Promise<never>(
          (_, reject) => setTimeout(() => reject(new Error('AI analysis timeout')), 1200000), // 20 minute timeout
        ),
      ]);

      // Parse the AI response
      const analysis = this.parseAiResponse(result.analysis, riskData);

      console.log(`[AI Analysis] Completed analysis for: ${analysisId} (confidence: ${result.confidence})`);

      return {
        hierarchyId: hierarchyRisk.hierarchyId,
        hierarchyName: hierarchyRisk.hierarchyName,
        riskId: hierarchyRisk.riskId,
        riskName: hierarchyRisk.riskName,
        riskType: hierarchyRisk.riskType,
        probability: hierarchyRisk.probability,
        analysis,
        confidence: result.confidence,
        questionsAnalyzed: hierarchyRisk.questions.length,
        metadata: {
          ...result.metadata,
          analysisId,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[AI Analysis] Failed to analyze ${analysisId}:`, {
        error: errorMessage,
        hierarchyId: hierarchyRisk.hierarchyId,
        riskId: hierarchyRisk.riskId,
        probability: hierarchyRisk.probability,
        questionsCount: hierarchyRisk.questions.length,
      });
      // Re-throw so the asyncBatch callback can convert the failure into a FAILED record
      // and the PROCESSING row is properly resolved.
      throw error instanceof Error ? error : new Error(errorMessage);
    }
  }

  private buildAnalysisContent(
    hierarchyRisk: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData,
    riskData: IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData,
  ): Array<{ type: 'text'; text: string }> {
    const content = [];

    // Add sector and risk information
    content.push({
      type: 'text' as const,
      text: `SETOR AVALIADO: ${hierarchyRisk.hierarchyName}
FRPS: ${hierarchyRisk.riskName}
PROBABILIDADE CALCULADA: ${hierarchyRisk.probability}

PERGUNTAS RELACIONADAS AO FRPS COM INDICADORES DE RESULTADO:`,
    });

    // Add questions and their results with indicators
    hierarchyRisk.questions.forEach((question, index) => {
      const totalResponses = question.values.length;

      // Calculate indicator distribution
      const muitoNegativo = question.values.filter((v) => v === 5).length;
      const negativo = question.values.filter((v) => v === 4).length;
      const neutro = question.values.filter((v) => v === 3).length;
      const positivo = question.values.filter((v) => v === 2).length;
      const muitoPositivo = question.values.filter((v) => v === 1).length;

      // Calculate percentages
      const muitoNegativoPct = totalResponses > 0 ? ((muitoNegativo / totalResponses) * 100).toFixed(1) : '0.0';
      const negativoPct = totalResponses > 0 ? ((negativo / totalResponses) * 100).toFixed(1) : '0.0';
      const neutroPct = totalResponses > 0 ? ((neutro / totalResponses) * 100).toFixed(1) : '0.0';
      const positivoPct = totalResponses > 0 ? ((positivo / totalResponses) * 100).toFixed(1) : '0.0';
      const muitoPositivoPct = totalResponses > 0 ? ((muitoPositivo / totalResponses) * 100).toFixed(1) : '0.0';

      // Calculate evidence score for this question
      const evidenceScore = muitoNegativo * 2 + negativo * 1 + neutro * 0 + positivo * -1 + muitoPositivo * -2;
      const normalizedScore = totalResponses > 0 ? (evidenceScore / totalResponses).toFixed(2) : '0.00';

      // Determine predominant indicator with tie-breaking logic
      const indicators = [
        { name: 'Muito Negativo', count: muitoNegativo, weight: 2, pct: muitoNegativoPct },
        { name: 'Negativo', count: negativo, weight: 1, pct: negativoPct },
        { name: 'Neutro', count: neutro, weight: 0, pct: neutroPct },
        { name: 'Positivo', count: positivo, weight: -1, pct: positivoPct },
        { name: 'Muito Positivo', count: muitoPositivo, weight: -2, pct: muitoPositivoPct },
      ];

      // Find predominant indicator (highest count, then highest weight in case of tie)
      const predominantIndicator = indicators.reduce((prev, current) => {
        if (current.count > prev.count) return current;
        if (current.count === prev.count && current.weight > prev.weight) return current;
        return prev;
      });

      // Determine risk level based on evidence score
      let riskLevel = 'Baixo';
      if (parseFloat(normalizedScore) >= 1.5) riskLevel = 'Muito Alto';
      else if (parseFloat(normalizedScore) >= 1.0) riskLevel = 'Alto';
      else if (parseFloat(normalizedScore) >= 0.5) riskLevel = 'Moderado';
      else if (parseFloat(normalizedScore) > 0) riskLevel = 'Baixo';
      else riskLevel = 'Proteção';

      content.push({
        type: 'text' as const,
        text: `
${index + 1}. ${question.text}
   - Muito Negativo: ${muitoNegativo}/${totalResponses} (${muitoNegativoPct}%)
   - Negativo: ${negativo}/${totalResponses} (${negativoPct}%)
   - Neutro: ${neutro}/${totalResponses} (${neutroPct}%)
   - Positivo: ${positivo}/${totalResponses} (${positivoPct}%)
   - Muito Positivo: ${muitoPositivo}/${totalResponses} (${muitoPositivoPct}%)
   - Indicador predominante: ${predominantIndicator.name} (${predominantIndicator.pct}%)
   - Score de evidência: ${normalizedScore} (Nível: ${riskLevel})
   - Valores individuais: [${question.values.join(', ')}]`,
      });
    });

    // Add summary of evidence levels
    const totalQuestions = hierarchyRisk.questions.length;
    const highRiskQuestions = hierarchyRisk.questions.filter((q) => {
      const totalResponses = q.values.length;
      const evidenceScore = totalResponses > 0 ? q.values.reduce((sum, v) => sum + (v === 5 ? 2 : v === 4 ? 1 : v === 3 ? 0 : v === 2 ? -1 : -2), 0) / totalResponses : 0;
      return evidenceScore >= 1.0;
    }).length;

    content.push({
      type: 'text' as const,
      text: `
RESUMO DA ANÁLISE DO SETOR:
- Total de perguntas analisadas: ${totalQuestions}
- Perguntas com nível Alto/Muito Alto: ${highRiskQuestions}
- Percentual de risco elevado: ${totalQuestions > 0 ? ((highRiskQuestions / totalQuestions) * 100).toFixed(1) : 0}%

FONTES GERADORAS CADASTRADAS NO SIMPLESST PARA ESTE FRPS:
${riskData.generateSources.map((gs, index) => `${index + 1}. ${gs.name}`).join('\n')}

RECOMENDAÇÕES DE ENGENHARIA CADASTRADAS NO SIMPLESST PARA ESTE FRPS:
${riskData.engineeringMeasures.map((eng, index) => `${index + 1}. ${eng.name}`).join('\n')}

RECOMENDAÇÕES ADMINISTRATIVAS CADASTRADAS NO SIMPLESST PARA ESTE FRPS:
${riskData.administrativeMeasures.map((adm, index) => `${index + 1}. ${adm.name}`).join('\n')}

INSTRUÇÕES PARA ASSOCIAÇÃO:
- Analise semanticamente cada pergunta e associe às fontes geradoras e medidas mais relevantes
- Use o score de evidência como critério principal de ordenação
- Considere o contexto específico do setor: ${hierarchyRisk.hierarchyName}
- Priorize itens com múltiplas perguntas de apoio
- RECOMENDAÇÕES de Medidas de Engenharia: foque em modificações físicas/equipamentos para isolar/remover perigo
- RECOMENDAÇÕES de Medidas Administrativas: foque em organização do trabalho para reduzir exposição`,
    });

    return content;
  }

  private getAnalysisPrompt(customPrompt?: string): string {
    if (customPrompt) {
      return customPrompt;
    }

    return `✅ Bloco 1 — Identificação e Escopo
INSTRUÇÕES DO SISTEMA (não visíveis ao usuário final)
Você é um assistente técnico integrado ao SimpleSST, responsável exclusivamente por apoiar a identificação de Fontes Geradoras e Recomendações para os Fatores de Riscos Psicossociais (FRPS) no PGR, com base nas respostas processadas do COPSOQ III por setor.
Sua função é auxiliar o profissional de SST na identificação automatizada de causas prováveis (fontes geradoras) e medidas de controle associadas, respeitando a lógica, os cadastros existentes e os cálculos oficiais já realizados pelo SimpleSST.
A IA não deve calcular probabilidade, severidade, nível de risco ocupacional ou prioridade de execução.
 
✅ Bloco 2 — Dados de entrada esperados
TAREFA PRINCIPAL
Quando receber os dados de entrada já estruturados pelo SimpleSST, contendo:
- Nome do setor avaliado
- Nome do FRPS
- Probabilidade calculada pelo SimpleSST (não deve ser alterada)
- Severidade cadastrada para o FRPS, quando aplicável
- Nível de Risco Ocupacional (NRO) calculado pelo SimpleSST, quando aplicável
- Lista das perguntas relacionadas ao FRPS com os respectivos indicadores de resultado (Muito Negativo, Negativo, Neutro, Positivo, Muito Positivo)
- Lista das Fontes Geradoras cadastradas no SimpleSST para aquele FRPS
- Lista das Medidas de Engenharia cadastradas no SimpleSST para aquele FRPS
- Lista das Medidas Administrativas cadastradas no SimpleSST para aquele FRPS
A IA deve utilizar esses dados como insumos de análise, sem buscar informações adicionais no banco de dados e sem alterar os cálculos oficiais do sistema.
 
DEFINIÇÕES IMPORTANTES:
- Medidas de Engenharia: modificações recomendadas no ambiente, posto, processo, equipamento, ferramenta ou recurso físico para eliminar, reduzir ou controlar a fonte do perigo.
- Medidas Administrativas: medidas organizacionais, gerenciais, procedimentais, comunicacionais ou de gestão do trabalho destinadas a prevenir, reduzir ou controlar a ocorrência do FRPS.
 
 
✅ Bloco 3 — Lógica operacional da IA
Você deverá utilizar:
- os indicadores padronizados das perguntas;
- o contexto semântico das respostas;
- a Probabilidade oficial calculada pelo SimpleSST;
- e o contexto operacional do setor avaliado;
 
para identificar quais Fontes Geradoras e Recomendações possuem relação lógica direta com o cenário analisado.
Os indicadores das perguntas devem servir exclusivamente para:
- validar a coerência das associações realizadas;
- ordenar os itens por aderência contextual;
- justificar tecnicamente a seleção dos itens sugeridos.
 
A IA não deve:
- criar scores próprios;
- calcular índices auxiliares;
- classificar criticidade;
- gerar níveis paralelos de risco;
- reinterpretar Probabilidade, Severidade ou NRO.
 
Toda priorização oficial, classificação de risco e definição de prazo pertencem exclusivamente aos módulos internos do SimpleSST.
 
 
2️⃣ ASSOCIAÇÃO INTELIGENTE
 
Relacione as perguntas do FRPS com as Fontes Geradoras, Medidas de Engenharia e Medidas Administrativas cadastradas no SimpleSST, selecionando apenas os itens que apresentem aderência lógica direta com:
- o conteúdo semântico da pergunta;
- o contexto operacional do setor avaliado;
- os indicadores padronizados observados nas respostas;
- a Probabilidade oficial calculada pelo SimpleSST.
 
A associação deve considerar que as Fontes Geradoras, Medidas de Engenharia e Medidas Administrativas estão cadastradas por FRPS, mas nem todos os itens cadastrados para um FRPS necessariamente se aplicam a todas as perguntas relacionadas a esse fator.
 
Itens sem aderência lógica direta com as perguntas analisadas não devem ser incluídos na seleção principal.
 
3️⃣ PRIORIZAÇÃO POR ADERÊNCIA CONTEXTUAL
A seleção deve priorizar os itens com maior aderência lógica ao cenário analisado, obedecendo à seguinte ordem:
1. maior relação semântica direta com as perguntas analisadas;
2. maior compatibilidade com os indicadores padronizados observados nas respostas;
3. maior aderência ao contexto operacional do setor avaliado;
4. alinhamento com a Probabilidade oficial calculada pelo SimpleSST;
5. ordem alfabética como último critério de desempate.
 
A priorização descrita neste item serve apenas para ordenar a apresentação das Fontes Geradoras, Medidas de Engenharia e Medidas Administrativas sugeridas pela IA.
 
Essa ordenação não representa prioridade de execução, nível de risco, prazo de implantação ou criticidade ocupacional, pois esses parâmetros são definidos exclusivamente pelos módulos internos do SimpleSST.
 
4️⃣ SELEÇÃO PRIORIZADA
Não inclua todos os itens cadastrados automaticamente.
Selecione somente os itens com maior aderência contextual ao cenário analisado, respeitando os seguintes limites:
- Máximo de 4 Fontes Geradoras;
- Máximo de 4 Recomendações no total, considerando Medidas de Engenharia e Medidas Administrativas.
A seleção deve considerar a relação lógica entre as perguntas, os indicadores padronizados, o contexto operacional do setor e a Probabilidade oficial calculada pelo SimpleSST.
Itens cadastrados sem relação direta com as perguntas analisadas não devem ser incluídos apenas por pertencerem ao mesmo FRPS.
 
 
5️⃣ REGRA DE ADERÊNCIA MÍNIMA
Na seleção principal:
- Priorize itens que estejam relacionados a pelo menos 1 pergunta do FRPS com aderência semântica direta;
- Itens sem relação direta com qualquer pergunta analisada não devem entrar na seleção principal;
- Itens cadastrados para o FRPS, mas sem aderência ao conteúdo das perguntas ou aos indicadores observados, devem ser descartados;
- Itens sem pergunta associada só podem ser usados como fallback quando não houver quantidade suficiente de itens com aderência direta;
- O uso de fallback deve ser excepcional e justificado de forma objetiva.
A regra de aderência mínima serve apenas para filtrar a seleção da IA, sem criar score, nível auxiliar de risco ou prioridade paralela.
 
 
6️⃣ JUSTIFICATIVAS PRECISAS
Para cada item selecionado, a justificativa deve citar de forma objetiva:
- a relação lógica entre o item e as perguntas analisadas;
- os indicadores padronizados que sustentam a associação;
- o contexto operacional observado no setor avaliado, quando aplicável.
 
As justificativas devem:
- ser técnicas, curtas e operacionais;
- possuir no máximo uma linha por item;
- evitar narrativas interpretativas extensas;
- evitar repetições entre diferentes itens.
 
Exemplo:
- “Indicadores negativos em autonomia sugerem processos com baixa flexibilidade operacional.”
- “Indicadores negativos em reconhecimento reforçam percepção de ausência de valorização profissional.”
 
7️⃣ RESTRIÇÕES ABSOLUTAS
Você não pode:
- alterar, criar ou reinterpretar probabilidades;
- calcular risco ocupacional;
- definir prioridade de execução ou prazo de implantação;
- criar classificação paralela de risco, criticidade, score ou nível auxiliar;
- criar múltiplos itens novos indiscriminadamente;
- gerar textos longos ou narrativos;
- tirar dúvidas metodológicas;
- citar o COPSOQ III, NRs ou documentos externos;
- repetir explicações;
- solicitar parâmetros ao usuário.
 
Priorize sempre os itens já cadastrados no SimpleSST.
 
Antes de sugerir qualquer item novo, a IA deve tentar utilizar as opções cadastradas que apresentem maior aderência ao conteúdo semântico das perguntas, aos indicadores padronizados observados e ao contexto operacional do setor.
 
A criação de item novo só é permitida em caráter excepcional, quando:
- não houver item cadastrado com aderência suficiente ao cenário analisado;
- ou houver evidência contextual clara de que os itens cadastrados não representam adequadamente o padrão identificado nas perguntas.
 
Nesses casos, a IA poderá sugerir:
- no máximo 1 nova Fonte Geradora;
- no máximo 1 nova Recomendação.
 
Todo item novo deve ser explicitamente identificado como:
[Item novo sugerido pela IA — requer validação humana]
 
Itens novos nunca devem ser incorporados automaticamente ao SimpleSST e dependem de aceite explícito do usuário antes de qualquer inclusão na base de dados ou no documento técnico.

✅ Bloco 4 — Formato da resposta (output padrão)
 
ESTRUTURA DA SAÍDA (obrigatória)
 
A resposta deve sempre seguir o formato abaixo:
FRPS: {nome do fator}
Setor: {nome do setor}
Probabilidade oficial SimpleSST: {probabilidade calculada pelo sistema}
NRO oficial SimpleSST: {nível de risco ocupacional calculado pelo sistema, quando disponível}
 
1️⃣ Fontes Geradoras sugeridas (até 4, base SimpleSST, ordenadas por aderência contextual)
- {Fonte Geradora 1}: {Justificativa curta}
- {Fonte Geradora 2}: {Justificativa curta}
 
2️⃣ Medidas de Engenharia sugeridas (base SimpleSST, quando aplicável)
- {Medida de Engenharia 1}: {Justificativa curta}
 
3️⃣ Medidas Administrativas sugeridas (base SimpleSST, quando aplicável)
- {Medida Administrativa 1}: {Justificativa curta}
- {Medida Administrativa 2}: {Justificativa curta}
 
4️⃣ Sugestões adicionais da IA (opcional — não cadastradas no SimpleSST)
- [Item novo sugerido pela IA — requer validação humana] {Nova Fonte/Medida}: {Justificativa curta}
 
FORMATO DA JUSTIFICATIVA:
- Não mencionar score, pontuação, nível auxiliar ou criticidade criada pela IA;
- Sempre indicar a relação lógica entre o item sugerido e as perguntas analisadas;
- Sempre utilizar os indicadores padronizados como base da justificativa;
- Quando útil, mencionar o contexto operacional do setor;
- Máximo de uma linha por item.
 
✅ Bloco 5 — Restrições
Regras Rígidas
A IA não pode:
- alterar, criar ou reinterpretar probabilidades;
- calcular risco ocupacional;
- definir prioridade de execução ou prazo de implantação;
- criar classificação paralela de risco, criticidade, score ou nível auxiliar;
- incorporar automaticamente novas Fontes Geradoras ou novas Medidas ao SimpleSST;
- criar múltiplos itens novos indiscriminadamente;
- gerar textos longos ou narrativos;
- tirar dúvidas metodológicas;
- citar o COPSOQ III, NRs ou documentos externos;
- repetir explicações;
- solicitar parâmetros ao usuário.
 
A IA pode sugerir, em caráter excepcional, nova Fonte Geradora ou nova Medida, desde que o item seja identificado como:
[Item novo sugerido pela IA — requer validação humana]

✅ Bloco 6 — Critério interno de ordenação
ALGORITMO DE ORDENAÇÃO POR ADERÊNCIA CONTEXTUAL
 
PASSO 1: Para cada item cadastrado:
a) Identifique as perguntas do FRPS que tenham relação semântica direta com o item;
b) Verifique os indicadores padronizados observados nessas perguntas;
c) Considere o contexto operacional do setor avaliado;
d) Considere a Probabilidade oficial calculada pelo SimpleSST apenas como contexto geral do FRPS, sem recalcular ou reinterpretar esse resultado.
 
PASSO 2: Classifique os itens pela seguinte ordem:
1º critério: maior relação semântica direta com as perguntas analisadas;
2º critério: maior compatibilidade com indicadores negativos ou desfavoráveis observados nas respostas;
3º critério: maior aderência ao contexto operacional do setor avaliado;
4º critério: alinhamento com a Probabilidade oficial calculada pelo SimpleSST;
5º critério: ordem alfabética como último critério de desempate.
 
PASSO 3: Regras adicionais:
- Itens sem relação direta com qualquer pergunta analisada não devem entrar na seleção principal;
- Itens cadastrados para o FRPS, mas sem aderência ao conteúdo das perguntas ou aos indicadores observados, devem ser descartados;
- Itens sem pergunta associada só podem ser usados como fallback quando não houver quantidade suficiente de itens com aderência direta;
- O uso de fallback deve ser excepcional e justificado de forma objetiva;
- O algoritmo não deve criar score, pontuação, nível auxiliar de risco ou criticidade paralela.
 
PASSO 4: Regra de redação conforme o sentido dos indicadores
- Quando os indicadores observados forem Negativos ou Muito Negativos, a justificativa pode descrever a associação como necessidade de correção, controle, redução ou melhoria.
- Quando os indicadores observados forem Positivos ou Muito Positivos, a justificativa não deve tratar o item como falha, deficiência ou necessidade corretiva.
- Nesses casos, a IA deve redigir a justificativa como medida de manutenção, formalização, preservação ou fortalecimento das boas práticas já evidenciadas.
- A redação deve deixar claro que, apesar dos indicadores favoráveis, o item foi sugerido por sua relação preventiva com o tema da pergunta e com a manutenção da condição positiva observada.
 
 
✅ Bloco 7 — Estilo e comportamento textual
 
Características da Escrita
- Técnica, direta e padronizada;
- Sem redundâncias;
- No máximo uma linha de justificativa por item;
- Foco na aderência contextual entre perguntas, indicadores padronizados, setor avaliado e item sugerido;
- Priorização da qualidade da associação lógica, não da quantidade de itens;
- Sem uso de expressões especulativas, como “talvez”, “aparentemente”, “pode indicar” ou equivalentes;
- Sem menção a score, pontuação, criticidade auxiliar ou nível paralelo de risco.
- Quando houver indicadores Positivos ou Muito Positivos, usar linguagem de manutenção, preservação ou fortalecimento, evitando tratar a condição favorável como falha.

Quando a justificativa se basear em indicadores Positivos ou Muito Positivos, utilizar linguagem preventiva, como:
- “Apesar dos indicadores favoráveis...”
- “A condição positiva observada reforça a importância de manter...”
- “Os indicadores favoráveis sustentam a manutenção de...”
- “A boa percepção registrada recomenda preservar...”
 
Evitar frases que transformem indicadores positivos em sinal de falha, deficiência ou demanda corretiva.
 
 
✅ Bloco 8 — Observação final
 
IMPORTANTE
A IA não define prioridades de execução nem prazos.
Esses parâmetros são determinados automaticamente pelo SimpleSST com base no cálculo do Nível de Risco Ocupacional (NRO), resultante do cruzamento entre Probabilidade e Severidade.
As sugestões da IA servem somente para identificar causas prováveis e medidas de controle associadas.
Toda sugestão gerada pela IA, inclusive eventual nova Fonte Geradora, Medida de Engenharia ou Medida Administrativa não cadastrada previamente, deve ser revisada e validada por um profissional legalmente habilitado antes de integrar a base de dados do SimpleSST, o Inventário de Riscos ou qualquer documento técnico do PGR.
A IA atua como apoio técnico automatizado e rastreável, sem substituir a análise técnica humana.
 
✅ Fim do Prompt`;
  }

  private getResponseSchema(): Record<string, any> {
    return {
      type: 'object',
      properties: {
        frps: { type: 'string' },
        fontesGeradoras: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              nome: { type: 'string' },
              justificativa: { type: 'string' },
              origem: { type: 'string', enum: ['sistema', 'ia'] },
            },
            required: ['nome', 'justificativa', 'origem'],
            additionalProperties: false,
          },
        },
        medidasEngenhariaRecomendadas: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              nome: { type: 'string' },
              justificativa: { type: 'string' },
              origem: { type: 'string', enum: ['sistema', 'ia'] },
            },
            required: ['nome', 'justificativa', 'origem'],
            additionalProperties: false,
          },
        },
        medidasAdministrativasRecomendadas: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              nome: { type: 'string' },
              justificativa: { type: 'string' },
              origem: { type: 'string', enum: ['sistema', 'ia'] },
            },
            required: ['nome', 'justificativa', 'origem'],
            additionalProperties: false,
          },
        },
      },
      required: ['frps', 'fontesGeradoras', 'medidasEngenhariaRecomendadas', 'medidasAdministrativasRecomendadas'],
      additionalProperties: false,
    };
  }

  private parseAiResponse(aiResponse: string, riskData: IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData): AiRiskAnalysisResponse {
    try {
      const parsed = JSON.parse(aiResponse) as AiRiskAnalysisResponse;

      // Use all AI suggestions without filtering

      return parsed;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Return a default response if parsing fails
      return {
        frps: riskData.name,
        fontesGeradoras: [],
        medidasEngenhariaRecomendadas: [],
        medidasAdministrativasRecomendadas: [],
      };
    }
  }

  /**
   * Get cached available risks for a company with their generateSources and recommendations
   */
  private async getCachedAvailableRisks(companyId: string): Promise<IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData[]> {
    const cache = new CacheProvider({
      cacheManager: this.cacheManager,
      ttlSeconds: CacheTtlEnum.MIN_10,
    });

    const cacheKey = `available-risks-with-sources-v2-${companyId}`;

    return cache.funcResponse(async () => {
      const risks = await this.prisma.riskFactors.findMany({
        where: {
          OR: [
            { companyId },
            { system: true },
            {
              company: {
                applyingServiceContracts: {
                  some: { receivingServiceCompanyId: companyId, status: 'ACTIVE' },
                },
              },
            },
          ],
          deleted_at: null,
          // Filter for psychosocial risks using subtype relationship
          subTypes: {
            some: {
              sub_type: {
                sub_type: 'PSICOSOCIAL',
              },
            },
          },
        },
        include: {
          generateSource: {
            where: { deleted_at: null },
          },
          recMed: {
            where: {
              deleted_at: null,
              system: true,
              OR: [{ medName: { not: null } }, { medName: { not: '' } }],
            },
          },
        },
      });

      return risks.map((risk) => {
        const engineeringMeasures = risk.recMed?.filter((rec) => rec.recType === 'ENG') || [];
        const administrativeMeasures = risk.recMed?.filter((rec) => rec.recType === 'ADM') || [];

        return {
          id: risk.id,
          name: risk.name,
          type: risk.type,
          severity: risk.severity,
          generateSources: risk.generateSource || [],
          recommendations: [], // Not used anymore
          administrativeMeasures: administrativeMeasures.map((adm) => ({
            id: adm.id,
            name: adm.recName || '',
          })),
          engineeringMeasures: engineeringMeasures.map((eng) => ({
            id: eng.id,
            name: eng.recName || '',
          })),
        };
      });
    }, cacheKey);
  }
}
