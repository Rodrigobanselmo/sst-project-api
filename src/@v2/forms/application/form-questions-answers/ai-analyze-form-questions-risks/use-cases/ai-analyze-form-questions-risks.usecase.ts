import { Injectable, Inject, BadRequestException, ForbiddenException } from '@nestjs/common';
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
import { resolveEffectiveRiskProbability } from '../../shared/utils/resolve-effective-risk-probability.util';
import { materializeHierarchyGroupRiskPairs } from '../../shared/utils/materialize-hierarchy-group-risk-pairs.util';
import { AiRiskAnalysisResponse } from '@/@v2/shared/types/ai-risk-analysis-response.types';
import { FormAiAnalysisStatusEnum } from '@prisma/client';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SystemAiPromptResolverService } from '@/@v2/forms/application/system-ai-prompt/services/system-ai-prompt-resolver.service';
import { SystemAiPromptKeyEnum } from '@/@v2/forms/application/system-ai-prompt/constants/system-ai-prompt-key.enum';
import {
  AiAnalyzeFormQuestionsRisksModeEnum,
  buildIncrementalPromptContext,
  computeAnalysisQuotas,
  getExcludedItemsFromMetadata,
  isRecentlyProcessingRecord,
  mergeAiRiskAnalysis,
  parseStoredAnalysisResponse,
  shouldSkipCompleteAnalysis,
} from './ai-risk-analysis-merge.helpers';

@Injectable()
export class AiAnalyzeFormQuestionsRisksUseCase {
  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly prisma: PrismaServiceV2,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly formQuestionsAnswersRisksService: FormQuestionsAnswersRisksService,
    private readonly systemAiPromptResolver: SystemAiPromptResolverService,
  ) {}

  async execute(params: IAiAnalyzeFormQuestionsRisksUseCase.Params): Promise<IAiAnalyzeFormQuestionsRisksUseCase.Result> {
    // Validate input parameters
    this.validateParams(params);

    const user = this.context.get<UserContext>(ContextKey.USER);
    const isSystemMaster = user.isAdmin;

    if (!isSystemMaster && params.customPrompt?.trim()) {
      throw new ForbiddenException('Apenas usuários master do sistema podem enviar prompt personalizado.');
    }

    if (!isSystemMaster && params.model) {
      throw new ForbiddenException('Apenas usuários master do sistema podem selecionar o modelo de IA.');
    }

    const resolvedPrompt = await this.systemAiPromptResolver.resolvePromptWithMeta(
      SystemAiPromptKeyEnum.RISK_SOURCES_RECOMMENDATIONS,
      isSystemMaster ? params.customPrompt : undefined,
    );

    const analysisPrompt = resolvedPrompt.content;

    if (!analysisPrompt?.trim()) {
      throw new BadRequestException('Prompt de análise não configurado para este tipo.');
    }

    console.log('[AI Analysis] Prompt resolved', {
      promptKey: SystemAiPromptKeyEnum.RISK_SOURCES_RECOMMENDATIONS,
      promptSource: resolvedPrompt.source,
      promptLength: analysisPrompt.length,
      promptRevision: resolvedPrompt.revision ?? null,
      isSystemMaster,
      hasCustomPromptInRequest: Boolean(params.customPrompt?.trim()),
    });

    const mode =
      params.mode ?? AiAnalyzeFormQuestionsRisksModeEnum.FULL;
    const isIncremental =
      mode === AiAnalyzeFormQuestionsRisksModeEnum.FULL_INCREMENTAL ||
      mode === AiAnalyzeFormQuestionsRisksModeEnum.TARGET;

    const paramsWithPrompt: IAiAnalyzeFormQuestionsRisksUseCase.Params = {
      ...params,
      mode,
      customPrompt: undefined,
      analysisPrompt,
    };

    const startTime = Date.now();
    let formData: IFormQuestionsAnswersRisksService.Result;
    let availableRisks: IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData[];

    try {
      // Get form questions and answers data by hierarchy and risk with detailed question information
      formData = await this.formQuestionsAnswersRisksService.getFormQuestionsAnswersRisks({
        companyId: paramsWithPrompt.companyId,
        formApplicationId: paramsWithPrompt.formApplicationId,
      });

      // Get available risks with their generateSources and recommendations
      availableRisks = await this.getCachedAvailableRisks(paramsWithPrompt.companyId);

      console.log(`[AI Analysis] Found ${Object.keys(formData.hierarchyRiskMap).length} hierarchies and ${Object.keys(formData.riskMap).length} risks for company ${paramsWithPrompt.companyId}`);
    } catch (error) {
      console.error('[AI Analysis] Failed to fetch form data or available risks:', error);
      throw new BadRequestException(`Failed to fetch required data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Transform the data into hierarchy-risk combinations for analysis
    const hierarchyRiskData = this.transformToHierarchyRiskData(formData, availableRisks);

    if (hierarchyRiskData.length === 0) {
      console.warn('[AI Analysis] No risk data found for analysis', {
        companyId: paramsWithPrompt.companyId,
        formApplicationId: paramsWithPrompt.formApplicationId,
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

    const existingPairKeys = new Set(
      hierarchyRiskData.map((item) =>
        this.buildPairKey(item.hierarchyId, item.riskId),
      ),
    );

    const syntheticPairs = materializeHierarchyGroupRiskPairs({
      formData,
      availableRisksMap,
      existingPairKeys,
      minOccupationalRiskLevel: MIN_OCCUPATIONAL_RISK_LEVEL,
    });

    if (syntheticPairs.length > 0) {
      console.log(
        `[AI Analysis] Materialized ${syntheticPairs.length} hierarchy-group synthetic pair(s)`,
      );
      hierarchyRiskData.push(...syntheticPairs);
    }

    const eligibleHierarchyRiskData = this.filterEligibleHierarchyRiskData(
      hierarchyRiskData,
      availableRisksMap,
      MIN_OCCUPATIONAL_RISK_LEVEL,
    );

    let scopedEligibleHierarchyRiskData = eligibleHierarchyRiskData;

    if (mode === AiAnalyzeFormQuestionsRisksModeEnum.TARGET) {
      if (!paramsWithPrompt.riskId || !paramsWithPrompt.hierarchyId) {
        throw new BadRequestException(
          'riskId e hierarchyId são obrigatórios para mode TARGET.',
        );
      }

      const targetPair = scopedEligibleHierarchyRiskData.find(
        (item) =>
          item.riskId === paramsWithPrompt.riskId &&
          item.hierarchyId === paramsWithPrompt.hierarchyId,
      );

      if (!targetPair) {
        throw new BadRequestException(
          'Par risco/setor não elegível para análise de IA.',
        );
      }

      scopedEligibleHierarchyRiskData = [targetPair];
    }

    const skippedEligibilityCount =
      hierarchyRiskData.length - scopedEligibleHierarchyRiskData.length;

    if (scopedEligibleHierarchyRiskData.length === 0) {
      console.warn('[AI Analysis] No eligible hierarchy-risk combinations to analyze', {
        companyId: paramsWithPrompt.companyId,
        formApplicationId: paramsWithPrompt.formApplicationId,
        totalCombinations: hierarchyRiskData.length,
      });
      throw new BadRequestException('No eligible risk data for analysis. Ensure the form has answered questions with non-zero probability.');
    }

    const existingRecords = await this.prisma.formAiAnalysis.findMany({
      where: {
        companyId: paramsWithPrompt.companyId,
        formApplicationId: paramsWithPrompt.formApplicationId,
      },
    });
    const existingRecordsByKey = new Map(
      existingRecords.map((record) => [
        this.buildPairKey(record.hierarchyId, record.riskId),
        record,
      ]),
    );

    const { jobs, analysesSkipped, analysesComplemented } =
      this.resolveAnalysisJobs({
        eligibleHierarchyRiskData: scopedEligibleHierarchyRiskData,
        existingRecordsByKey,
        isIncremental,
      });

    const totalSkipped = skippedEligibilityCount + analysesSkipped;

    console.log(
      `[AI Analysis] Mode=${mode} Eligible=${scopedEligibleHierarchyRiskData.length} Queued=${jobs.length} Skipped=${totalSkipped} Complemented=${analysesComplemented}`,
    );

    if (jobs.length === 0) {
      return {
        analyses: [],
        totalHierarchies: new Set(
          scopedEligibleHierarchyRiskData.map((hr) => hr.hierarchyId),
        ).size,
        totalRisks: new Set(scopedEligibleHierarchyRiskData.map((hr) => hr.riskId))
          .size,
        totalAnalyses: 0,
        metadata: {
          companyId: paramsWithPrompt.companyId,
          formApplicationId: paramsWithPrompt.formApplicationId,
          timestamp: new Date().toISOString(),
          model: paramsWithPrompt.model,
          processingTimeMs: Date.now() - startTime,
          analysesQueued: 0,
          analysesSkipped: totalSkipped,
          analysesComplemented,
          mode,
          targetRiskId: paramsWithPrompt.riskId,
          targetHierarchyId: paramsWithPrompt.hierarchyId,
          promptKey: SystemAiPromptKeyEnum.RISK_SOURCES_RECOMMENDATIONS,
          promptSource: resolvedPrompt.source,
          promptLength: analysisPrompt.length,
          promptRevision: resolvedPrompt.revision,
        },
      };
    }

    try {
      await this.createProcessingRecords(jobs, paramsWithPrompt, isIncremental);
      console.log(`[AI Analysis] Created processing records for ${jobs.length} analyses`);
    } catch (error) {
      console.error('[AI Analysis] Failed to create processing records:', error);
      throw new BadRequestException(`Failed to create processing records: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    void this.runAnalysesInBackground(
      jobs,
      availableRisks,
      paramsWithPrompt,
      isIncremental,
    ).catch((error) => {
      console.error('[AI Analysis] Background runner unhandled rejection:', error);
    });

    return {
      analyses: [],
      totalHierarchies: new Set(jobs.map((job) => job.hierarchyRisk.hierarchyId))
        .size,
      totalRisks: new Set(jobs.map((job) => job.hierarchyRisk.riskId)).size,
      totalAnalyses: 0,
      metadata: {
        companyId: paramsWithPrompt.companyId,
        formApplicationId: paramsWithPrompt.formApplicationId,
        timestamp: new Date().toISOString(),
        model: paramsWithPrompt.model,
        processingTimeMs: Date.now() - startTime,
        analysesQueued: jobs.length,
        analysesSkipped: totalSkipped,
        analysesComplemented,
        mode,
        targetRiskId: paramsWithPrompt.riskId,
        targetHierarchyId: paramsWithPrompt.hierarchyId,
        promptKey: SystemAiPromptKeyEnum.RISK_SOURCES_RECOMMENDATIONS,
        promptSource: resolvedPrompt.source,
        promptLength: analysisPrompt.length,
        promptRevision: resolvedPrompt.revision,
      },
    };
  }

  private filterEligibleHierarchyRiskData(
    hierarchyRiskData: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[],
    availableRisksMap: Map<string, IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData>,
    minOccupationalRiskLevel: number,
  ): IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[] {
    return hierarchyRiskData.filter((item) => {
      const risk = availableRisksMap.get(item.riskId);
      if (!risk) return false;
      if (item.questions.length === 0) return false;
      if (item.probability === 0) return false;

      const nro = getMatrizRisk(risk.severity, item.probability);
      if (nro < minOccupationalRiskLevel) return false;

      return true;
    });
  }

  private buildPairKey(hierarchyId: string, riskId: string): string {
    return `${hierarchyId}:${riskId}`;
  }

  private resolveAnalysisJobs(params: {
    eligibleHierarchyRiskData: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[];
    existingRecordsByKey: Map<
      string,
      {
        status: FormAiAnalysisStatusEnum;
        analysis: unknown;
        metadata: unknown;
        updated_at: Date;
        created_at: Date;
      }
    >;
    isIncremental: boolean;
  }): {
    jobs: IAiAnalyzeFormQuestionsRisksUseCase.AnalysisJob[];
    analysesSkipped: number;
    analysesComplemented: number;
  } {
    const jobs: IAiAnalyzeFormQuestionsRisksUseCase.AnalysisJob[] = [];
    let analysesSkipped = 0;
    let analysesComplemented = 0;

    for (const hierarchyRisk of params.eligibleHierarchyRiskData) {
      const pairKey = this.buildPairKey(
        hierarchyRisk.hierarchyId,
        hierarchyRisk.riskId,
      );
      const existingRecord = params.existingRecordsByKey.get(pairKey);
      const existingMetadata =
        (existingRecord?.metadata as Record<string, unknown> | null) ?? {};
      const excludedItems = getExcludedItemsFromMetadata(existingMetadata);
      const existingAnalysis =
        existingRecord?.analysis &&
        existingRecord.status !== FormAiAnalysisStatusEnum.PROCESSING
          ? parseStoredAnalysisResponse(existingRecord.analysis)
          : null;

      if (
        existingRecord &&
        isRecentlyProcessingRecord({
          status: existingRecord.status,
          updatedAt: existingRecord.updated_at,
          createdAt: existingRecord.created_at,
        })
      ) {
        analysesSkipped += 1;
        continue;
      }

      const quotas = computeAnalysisQuotas(existingAnalysis);

      if (params.isIncremental && shouldSkipCompleteAnalysis(quotas)) {
        analysesSkipped += 1;
        continue;
      }

      if (
        params.isIncremental &&
        existingAnalysis &&
        (quotas.missingSources < 4 || quotas.missingRecommendations < 4)
      ) {
        analysesComplemented += 1;
      }

      jobs.push({
        hierarchyRisk,
        existingAnalysis,
        existingMetadata,
        excludedItems,
        quotas,
      });
    }

    return { jobs, analysesSkipped, analysesComplemented };
  }

  private async runAnalysesInBackground(
    jobs: IAiAnalyzeFormQuestionsRisksUseCase.AnalysisJob[],
    availableRisks: IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData[],
    params: IAiAnalyzeFormQuestionsRisksUseCase.Params,
    isIncremental: boolean,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      const analyses = await asyncBatch({
        items: jobs,
        batchSize: 10,
        callback: async (job, batchIndex, chunkIndex) => {
          const { hierarchyRisk } = job;
          console.log(`[AI Analysis] Processing batch ${batchIndex}, chunk ${chunkIndex}: ${hierarchyRisk.hierarchyName} - ${hierarchyRisk.riskName}`);
          try {
            return await this.analyzeHierarchyRisk(
              job,
              availableRisks,
              params,
              isIncremental,
            );
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

      if (successfulAnalyses.length === 0 && failedAnalysesData.length > 0) {
        const sampleError = failedAnalysesData[0]?.error ?? 'unknown';
        console.warn('[AI Analysis] Batch finished with zero successes', {
          formApplicationId: params.formApplicationId,
          failedCount: failedAnalysesData.length,
          sampleError: sampleError.slice(0, 200),
        });
      }

      if (successfulAnalyses.length > 0) {
        try {
          await this.storeAnalysesToDatabase(
            successfulAnalyses,
            params,
            processingTimeMs,
            isIncremental,
          );
        } catch (error) {
          console.error('[AI Analysis] Failed to store analyses to database:', error);
        }
      }

      if (failedAnalysesData.length > 0) {
        try {
          await this.storeFailedAnalysesToDatabase(
            failedAnalysesData,
            params,
            isIncremental,
          );
        } catch (error) {
          console.error('[AI Analysis] Failed to store failed analyses to database:', error);
        }
      }

      const resolvedKeys = new Set<string>([
        ...successfulAnalyses.map((a) => `${a.hierarchyId}:${a.riskId}`),
        ...failedAnalysesData.map((a) => `${a.hierarchyId}:${a.riskId}`),
      ]);
      const orphanData = jobs.filter(
        (job) =>
          !resolvedKeys.has(
            `${job.hierarchyRisk.hierarchyId}:${job.hierarchyRisk.riskId}`,
          ),
      );
      if (orphanData.length > 0) {
        console.warn(`[AI Analysis] ${orphanData.length} orphan PROCESSING records detected, marking as FAILED`);
        try {
          await this.storeFailedAnalysesToDatabase(
            orphanData.map((job) => ({
              hierarchyId: job.hierarchyRisk.hierarchyId,
              riskId: job.hierarchyRisk.riskId,
              error: 'Analysis returned no result',
            })),
            params,
            isIncremental,
          );
        } catch (error) {
          console.error('[AI Analysis] Failed to mark orphan analyses as FAILED:', error);
        }
      }
    } catch (error) {
      console.error('[AI Analysis] Catastrophic background error, marking all eligible records as FAILED:', error);
      try {
        await this.storeFailedAnalysesToDatabase(
          jobs.map((job) => ({
            hierarchyId: job.hierarchyRisk.hierarchyId,
            riskId: job.hierarchyRisk.riskId,
            error: error instanceof Error ? error.message : 'Unknown background error',
          })),
          params,
          isIncremental,
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
    isIncremental: boolean,
  ): Promise<void> {
    await Promise.all(
      analyses.map(async (analysis) => {
        const existingRecord = await this.prisma.formAiAnalysis.findUnique({
          where: {
            formApplicationId_hierarchyId_riskId: {
              formApplicationId: params.formApplicationId,
              hierarchyId: analysis.hierarchyId,
              riskId: analysis.riskId,
            },
          },
        });
        const existingMetadata =
          (existingRecord?.metadata as Record<string, unknown> | null) ?? {};
        const preservedExcludedItems = getExcludedItemsFromMetadata(
          existingMetadata,
        );

        const data = {
          companyId: params.companyId,
          formApplicationId: params.formApplicationId,
          hierarchyId: analysis.hierarchyId,
          riskId: analysis.riskId,
          status: FormAiAnalysisStatusEnum.DONE,
          probability: analysis.probability,
          confidence: analysis.confidence,
          analysis: analysis.analysis as any,
          metadata: {
            ...existingMetadata,
            ...(analysis.metadata || {}),
            ...(isIncremental
              ? { excludedItems: preservedExcludedItems }
              : {}),
          },
          model: params.model,
          processingTimeMs,
        };

        return this.prisma.formAiAnalysis.upsert({
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
        });
      }),
    );
  }

  private async storeFailedAnalysesToDatabase(
    failedAnalyses: Array<{ hierarchyId: string; riskId: string; error: string }>,
    params: IAiAnalyzeFormQuestionsRisksUseCase.Params,
    isIncremental: boolean,
  ): Promise<void> {
    if (failedAnalyses.length === 0) return;

    await Promise.all(
      failedAnalyses.map(async (failed) => {
        const existingRecord = await this.prisma.formAiAnalysis.findUnique({
          where: {
            formApplicationId_hierarchyId_riskId: {
              formApplicationId: params.formApplicationId,
              hierarchyId: failed.hierarchyId,
              riskId: failed.riskId,
            },
          },
        });
        const existingMetadata =
          (existingRecord?.metadata as Record<string, unknown> | null) ?? {};

        const data = {
          companyId: params.companyId,
          formApplicationId: params.formApplicationId,
          hierarchyId: failed.hierarchyId,
          riskId: failed.riskId,
          status: FormAiAnalysisStatusEnum.FAILED,
          probability: isIncremental ? existingRecord?.probability ?? null : null,
          confidence: isIncremental ? existingRecord?.confidence ?? null : null,
          analysis: isIncremental ? existingRecord?.analysis ?? null : null,
          metadata: {
            ...existingMetadata,
            error: failed.error,
          },
          model: params.model,
          processingTimeMs: null,
        };

        return this.prisma.formAiAnalysis.upsert({
          where: {
            formApplicationId_hierarchyId_riskId: {
              formApplicationId: data.formApplicationId,
              hierarchyId: data.hierarchyId,
              riskId: data.riskId,
            },
          },
          update: {
            status: data.status,
            ...(isIncremental
              ? {}
              : {
                  probability: null,
                  confidence: null,
                  analysis: null,
                }),
            metadata: data.metadata,
            updated_at: new Date(),
          },
          create: data,
        });
      }),
    );
  }

  private async createProcessingRecords(
    jobs: IAiAnalyzeFormQuestionsRisksUseCase.AnalysisJob[],
    params: IAiAnalyzeFormQuestionsRisksUseCase.Params,
    isIncremental: boolean,
  ): Promise<void> {
    await Promise.all(
      jobs.map(async (job) => {
        const existingRecord = await this.prisma.formAiAnalysis.findUnique({
          where: {
            formApplicationId_hierarchyId_riskId: {
              formApplicationId: params.formApplicationId,
              hierarchyId: job.hierarchyRisk.hierarchyId,
              riskId: job.hierarchyRisk.riskId,
            },
          },
        });
        const existingMetadata =
          (existingRecord?.metadata as Record<string, unknown> | null) ?? {};

        const data = {
          companyId: params.companyId,
          formApplicationId: params.formApplicationId,
          hierarchyId: job.hierarchyRisk.hierarchyId,
          riskId: job.hierarchyRisk.riskId,
          status: FormAiAnalysisStatusEnum.PROCESSING,
          probability: isIncremental ? existingRecord?.probability ?? null : null,
          confidence: isIncremental ? existingRecord?.confidence ?? null : null,
          analysis: isIncremental ? existingRecord?.analysis ?? null : null,
          metadata: {
            ...existingMetadata,
            startedAt: new Date().toISOString(),
          },
          model: params.model,
          processingTimeMs: null,
        };

        return this.prisma.formAiAnalysis.upsert({
          where: {
            formApplicationId_hierarchyId_riskId: {
              formApplicationId: data.formApplicationId,
              hierarchyId: data.hierarchyId,
              riskId: data.riskId,
            },
          },
          update: {
            status: data.status,
            ...(isIncremental
              ? {}
              : {
                  analysis: null,
                  probability: null,
                  confidence: null,
                }),
            metadata: data.metadata,
            model: data.model,
            processingTimeMs: null,
            updated_at: new Date(),
          },
          create: data,
        });
      }),
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

    if (
      params.mode &&
      !Object.values(AiAnalyzeFormQuestionsRisksModeEnum).includes(params.mode)
    ) {
      throw new BadRequestException('mode inválido.');
    }

    if (params.mode === AiAnalyzeFormQuestionsRisksModeEnum.TARGET) {
      if (!params.riskId || !params.hierarchyId) {
        throw new BadRequestException(
          'riskId e hierarchyId são obrigatórios para mode TARGET.',
        );
      }
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

        const effective = resolveEffectiveRiskProbability({
          hierarchyId,
          riskId,
          entityRiskMap: formData.entityRiskMap,
          groupedEntityRiskMap: formData.groupedEntityRiskMap,
          hierarchyGroups: formData.hierarchyGroups,
          individualProbabilityFallback: riskSummary.probability,
        });

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
            probability: effective.probability,
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
          probability: effective.probability,
          questions,
          probabilitySource: effective.source,
          hierarchyGroupId: effective.groupId,
          hierarchyGroupName: effective.groupName,
        });
      });
    });

    return hierarchyRiskData;
  }

  private async analyzeHierarchyRisk(
    job: IAiAnalyzeFormQuestionsRisksUseCase.AnalysisJob,
    availableRisks: IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData[],
    params: IAiAnalyzeFormQuestionsRisksUseCase.Params,
    isIncremental: boolean,
  ): Promise<IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskAnalysis> {
    const hierarchyRisk = job.hierarchyRisk;
    const analysisId = `${hierarchyRisk.hierarchyName}-${hierarchyRisk.riskName}`;

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

      const content = this.buildAnalysisContent(hierarchyRisk, riskData);
      const incrementalContext = isIncremental
        ? buildIncrementalPromptContext({
            existing: job.existingAnalysis,
            excludedItems: job.excludedItems,
            quotas: job.quotas,
          })
        : '';
      const prompt = [params.analysisPrompt ?? '', incrementalContext]
        .filter(Boolean)
        .join('\n\n');

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
              schema: this.getResponseSchema(job.quotas, isIncremental),
            },
          },
          systemPrompt:
            'Você é um assistente técnico integrado ao SimpleSST, responsável exclusivamente por sugerir Fontes Geradoras e Recomendações para os Fatores de Riscos Psicossociais (FRPS) dentro do PGR.',
          model: params.model,
        }),
        new Promise<never>(
          (_, reject) => setTimeout(() => reject(new Error('AI analysis timeout')), 1200000),
        ),
      ]);

      const parsedAnalysis = this.parseAiResponse(result.analysis, riskData);
      const analysis = isIncremental
        ? mergeAiRiskAnalysis({
            existing: job.existingAnalysis,
            incoming: parsedAnalysis,
            excludedItems: job.excludedItems,
            riskName: hierarchyRisk.riskName,
          })
        : parsedAnalysis;

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
          ...job.existingMetadata,
          ...result.metadata,
          analysisId,
          timestamp: new Date().toISOString(),
          excludedItems: job.excludedItems,
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

    const probabilityNote =
      hierarchyRisk.probabilitySource === 'hierarchy_group' && hierarchyRisk.hierarchyGroupName
        ? ` (probabilidade oficial calculada pelo agrupamento de setores "${hierarchyRisk.hierarchyGroupName}")`
        : '';

    // Add sector and risk information
    content.push({
      type: 'text' as const,
      text: `SETOR AVALIADO: ${hierarchyRisk.hierarchyName}
FRPS: ${hierarchyRisk.riskName}
PROBABILIDADE CALCULADA: ${hierarchyRisk.probability}${probabilityNote}

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


  private getResponseSchema(
    quotas?: { missingSources: number; missingRecommendations: number },
    isIncremental = false,
  ): Record<string, any> {
    const maxSources = isIncremental
      ? Math.max(quotas?.missingSources ?? 4, 0)
      : 4;
    const maxRecommendations = isIncremental
      ? Math.max(quotas?.missingRecommendations ?? 4, 0)
      : 4;

    return {
      type: 'object',
      properties: {
        frps: { type: 'string' },
        fontesGeradoras: {
          type: 'array',
          maxItems: maxSources,
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
          maxItems: maxRecommendations,
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
          maxItems: maxRecommendations,
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
