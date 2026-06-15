import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FormAiAnalysisStatusEnum } from '@prisma/client';

import { resolveIndicatorsNarrativeDiagnosticModel } from '@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/constants/resolve-indicators-narrative-diagnostic-model';
import { SystemAiPromptKeyEnum } from '@/@v2/forms/application/system-ai-prompt/constants/system-ai-prompt-key.enum';
import { SystemAiPromptResolverService } from '@/@v2/forms/application/system-ai-prompt/services/system-ai-prompt-resolver.service';
import { FormIndicatorsNarrativeDiagnosticRepository } from '@/@v2/forms/database/repositories/form-indicators-narrative-diagnostic/form-indicators-narrative-diagnostic.repository';
import { FormQuestionsAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-questions-answers-browse.model';
import { AiAdapter } from '@/@v2/shared/adapters/ai/ai.interface';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { CompanyGroupConsolidatedViewContextService } from './company-group-consolidated-view-context.service';
import { CompanyGroupConsolidatedViewQuestionsAnswersService } from './company-group-consolidated-view-questions-answers.service';
import { BuildConsolidatedIndicatorsNarrativeInputService } from './build-consolidated-indicators-narrative-input.service';
import {
  buildConsolidatedIndicatorsNarrativeScopeKey,
  ConsolidatedIndicatorsNarrativeScope,
  getConsolidatedIndicatorsNarrativeStorageAnchor,
  normalizeConsolidatedIndicatorsNarrativeScope,
} from '../utils/consolidated-indicators-narrative-scope.types';

const PROCESSING_STALE_MS = 60 * 60 * 1000;

export type ConsolidatedIndicatorsNarrativeDiagnosticResult = {
  id: string;
  mode: 'virtual_consolidated';
  businessGroupId: number;
  businessGroupName: string;
  applicationIds: string[];
  scopeKey: string;
  scope: ConsolidatedIndicatorsNarrativeScope;
  status: FormAiAnalysisStatusEnum;
  contentMarkdown?: string | null;
  metadata?: Record<string, unknown>;
  model?: string | null;
  processingTimeMs?: number | null;
  createdAt: string;
  updatedAt: string;
  analysesQueued?: boolean;
};

@Injectable()
export class CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticService {
  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly contextService: CompanyGroupConsolidatedViewContextService,
    private readonly questionsAnswersService: CompanyGroupConsolidatedViewQuestionsAnswersService,
    private readonly buildInputService: BuildConsolidatedIndicatorsNarrativeInputService,
    private readonly repository: FormIndicatorsNarrativeDiagnosticRepository,
    private readonly systemAiPromptResolver: SystemAiPromptResolverService,
  ) {}

  async read(params: {
    companyGroupId: number;
    applicationIds?: string[];
    scopeKey?: string;
    scope: ConsolidatedIndicatorsNarrativeScope;
    user: UserPayloadDto;
  }): Promise<ConsolidatedIndicatorsNarrativeDiagnosticResult | null> {
    const context = await this.contextService.resolve({
      companyGroupId: params.companyGroupId,
      applicationIds: params.applicationIds,
      user: params.user,
    });

    const scope = normalizeConsolidatedIndicatorsNarrativeScope(params.scope);
    const applicationIds = context.applications.map((app) => app.applicationId);
    const scopeKey =
      params.scopeKey?.trim() ||
      buildConsolidatedIndicatorsNarrativeScopeKey({
        companyGroupId: context.companyGroupId,
        applicationIds,
        scope,
      });
    const storageApplicationId = getConsolidatedIndicatorsNarrativeStorageAnchor({
      applicationIds,
    });

    const record = await this.repository.findByApplicationAndScope(
      storageApplicationId,
      scopeKey,
    );

    if (!record) return null;

    return this.mapRecord(record, context, applicationIds);
  }

  async generate(params: {
    companyGroupId: number;
    applicationIds?: string[];
    scope: ConsolidatedIndicatorsNarrativeScope;
    customPrompt?: string;
    model?: string;
    regenerate?: boolean;
    user: UserPayloadDto;
  }): Promise<ConsolidatedIndicatorsNarrativeDiagnosticResult> {
    const user = this.context.get<UserContext>(ContextKey.USER);
    const isSystemMaster = user.isAdmin;

    if (!isSystemMaster && params.customPrompt?.trim()) {
      throw new ForbiddenException(
        'Apenas usuários master do sistema podem enviar prompt personalizado.',
      );
    }

    if (!isSystemMaster && params.model) {
      throw new ForbiddenException(
        'Apenas usuários master do sistema podem selecionar o modelo de IA.',
      );
    }

    const context = await this.contextService.resolve({
      companyGroupId: params.companyGroupId,
      applicationIds: params.applicationIds,
      user: params.user,
    });

    const scope = normalizeConsolidatedIndicatorsNarrativeScope(params.scope);
    const applicationIds = context.applications.map((app) => app.applicationId);
    const scopeKey = buildConsolidatedIndicatorsNarrativeScopeKey({
      companyGroupId: context.companyGroupId,
      applicationIds,
      scope,
    });
    const storageApplicationId = getConsolidatedIndicatorsNarrativeStorageAnchor({
      applicationIds,
    });
    const anchorCompanyId = context.applications[0]?.companyId;

    if (!storageApplicationId || !anchorCompanyId) {
      throw new BadRequestException('Não foi possível determinar a âncora da consolidação.');
    }

    const existing = await this.repository.findByApplicationAndScope(
      storageApplicationId,
      scopeKey,
    );

    if (existing?.status === FormAiAnalysisStatusEnum.PROCESSING) {
      const isStale = Date.now() - existing.updated_at.getTime() > PROCESSING_STALE_MS;
      if (!isStale) {
        throw new ConflictException(
          'Já existe uma narrativa consolidada em processamento para este recorte.',
        );
      }
    }

    if (
      existing?.status === FormAiAnalysisStatusEnum.DONE &&
      existing.contentMarkdown?.trim() &&
      !params.regenerate
    ) {
      throw new ConflictException(
        'Já existe uma narrativa consolidada salva para este recorte. Envie regenerate=true para regerar.',
      );
    }

    const promptKey = scope.showOnlyGroupIndicators
      ? SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_ONLY
      : SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_AND_QUESTIONS;

    let resolvedPrompt = await this.systemAiPromptResolver.resolvePromptWithMeta(
      promptKey,
      isSystemMaster ? params.customPrompt : undefined,
    );

    if (!resolvedPrompt.content?.trim()) {
      resolvedPrompt = await this.systemAiPromptResolver.resolvePromptWithMeta(
        SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_DIAGNOSTIC,
        isSystemMaster ? params.customPrompt : undefined,
      );
    }

    if (!resolvedPrompt.content?.trim()) {
      throw new BadRequestException(
        'Prompt de narrativa consolidada de indicadores não configurado.',
      );
    }

    const effectiveModel = resolveIndicatorsNarrativeDiagnosticModel(
      isSystemMaster ? params.model : undefined,
    );

    const processingRecord = await this.repository.upsertProcessing({
      companyId: anchorCompanyId,
      formApplicationId: storageApplicationId,
      scopeKey,
      scope: scope as unknown as import('@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/shared/indicators-narrative-diagnostic-scope.types').IndicatorsNarrativeDiagnosticScope,
      model: effectiveModel,
      generatedBy: user.id,
      metadata: {
        mode: 'virtual_consolidated',
        companyGroupId: context.companyGroupId,
        businessGroupName: context.companyGroupName,
        applicationIds,
        promptKey,
        promptSource: resolvedPrompt.source,
        promptRevision: resolvedPrompt.revision ?? null,
        regenerate: Boolean(params.regenerate),
        consolidatedScope: scope,
      },
    });

    void this.runInBackground({
      context,
      applicationIds,
      scopeKey,
      scope,
      storageApplicationId,
      promptKey,
      analysisPrompt: resolvedPrompt.content,
      promptMeta: resolvedPrompt,
      model: effectiveModel,
    }).catch((error) => {
      console.error('[Consolidated Indicators Narrative] Background unhandled rejection:', error);
    });

    return {
      ...this.mapRecord(processingRecord, context, applicationIds),
      analysesQueued: true,
    };
  }

  private async runInBackground(params: {
    context: Awaited<ReturnType<CompanyGroupConsolidatedViewContextService['resolve']>>;
    applicationIds: string[];
    scopeKey: string;
    scope: ConsolidatedIndicatorsNarrativeScope;
    storageApplicationId: string;
    promptKey: SystemAiPromptKeyEnum;
    analysisPrompt: string;
    promptMeta: { source: string; revision?: number };
    model?: string;
  }): Promise<void> {
    const startTime = Date.now();

    try {
      const listing = await this.questionsAnswersService.list({
        applications: params.context.applications,
        structureFingerprint: params.context.matchingSet.structureFingerprint,
      });

      const uniqueCompanies = new Set(
        params.context.applications.map((application) => application.companyId),
      );

      const formQuestionsAnswers = new FormQuestionsAnswersBrowseModel({
        results: listing.results,
        participantStructures: listing.participantStructures,
      });

      const input = this.buildInputService.build({
        formQuestionsAnswers,
        scope: params.scope,
        businessGroupName: params.context.companyGroupName,
        formName: params.context.matchingSet.formName,
        applicationCount: params.context.applications.length,
        companyCount: uniqueCompanies.size,
        totals: listing.totals,
      });

      if (input.summary.formGroupCount === 0 || input.summary.visibleIndicatorRows === 0) {
        throw new BadRequestException(
          'Não há indicadores calculáveis neste agrupamento consolidado para gerar a narrativa.',
        );
      }

      const result = await Promise.race([
        this.aiAdapter.analyze({
          content: input.content,
          prompt: params.analysisPrompt,
          language: 'pt-BR',
          responseFormat: 'text',
          systemPrompt:
            'Você redige diagnósticos narrativos executivos em Markdown sobre indicadores psicossociais consolidados de um grupo empresarial. Interprete os percentuais e scores fornecidos no conteúdo — não recalcule. Não explique genericamente COPSOQ, FRPS ou metodologias. Não descreva apenas a metodologia. Destaque achados prioritários, construtos mais críticos e mais favoráveis, e compare subgrupos do agrupamento somente quando houver dados não protegidos. Respeite [OCULTO POR SIGILO] sem inferir valores. Não trate os dados como matriz de risco ocupacional. Não gere probabilidade de risco, fonte geradora, inventário, PGR, plano de ação ou medidas de controle específicas.',
          model: params.model,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Consolidated indicators narrative timeout')),
            20 * 60 * 1000,
          ),
        ),
      ]);

      const markdown = result.analysis?.trim();
      if (!markdown) {
        throw new Error('A IA retornou conteúdo vazio para a narrativa consolidada.');
      }

      await this.repository.updateDone({
        formApplicationId: params.storageApplicationId,
        scopeKey: params.scopeKey,
        contentMarkdown: markdown,
        model: params.model,
        processingTimeMs: Date.now() - startTime,
        metadata: {
          mode: 'virtual_consolidated',
          companyGroupId: params.context.companyGroupId,
          applicationIds: params.applicationIds,
          promptKey: params.promptKey,
          promptSource: params.promptMeta.source,
          promptRevision: params.promptMeta.revision ?? null,
          inputSummary: input.summary,
          confidence: result.confidence,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await this.repository.updateFailed({
        formApplicationId: params.storageApplicationId,
        scopeKey: params.scopeKey,
        error: errorMessage,
      });
    }
  }

  private mapRecord(
    record: {
      id: string;
      scopeKey: string;
      scope: unknown;
      status: FormAiAnalysisStatusEnum;
      contentMarkdown: string | null;
      metadata: unknown;
      model: string | null;
      processingTimeMs: number | null;
      created_at: Date;
      updated_at: Date;
    },
    context: Awaited<ReturnType<CompanyGroupConsolidatedViewContextService['resolve']>>,
    applicationIds: string[],
  ): ConsolidatedIndicatorsNarrativeDiagnosticResult {
    const metadata = (record.metadata as Record<string, unknown>) ?? {};
    const scope =
      (metadata.consolidatedScope as ConsolidatedIndicatorsNarrativeScope | undefined) ??
      normalizeConsolidatedIndicatorsNarrativeScope(
        record.scope as ConsolidatedIndicatorsNarrativeScope,
      );

    return {
      id: record.id,
      mode: 'virtual_consolidated',
      businessGroupId: context.companyGroupId,
      businessGroupName: context.companyGroupName,
      applicationIds,
      scopeKey: record.scopeKey,
      scope,
      status: record.status,
      contentMarkdown: record.contentMarkdown,
      metadata,
      model: record.model,
      processingTimeMs: record.processingTimeMs,
      createdAt: record.created_at.toISOString(),
      updatedAt: record.updated_at.toISOString(),
    };
  }
}
