import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FormAiAnalysisStatusEnum } from '@prisma/client';
import { AiAdapter } from '@/@v2/shared/adapters/ai/ai.interface';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { SystemAiPromptKeyEnum } from '@/@v2/forms/application/system-ai-prompt/constants/system-ai-prompt-key.enum';
import { SystemAiPromptResolverService } from '@/@v2/forms/application/system-ai-prompt/services/system-ai-prompt-resolver.service';
import { FormIndicatorsNarrativeDiagnosticRepository } from '@/@v2/forms/database/repositories/form-indicators-narrative-diagnostic/form-indicators-narrative-diagnostic.repository';
import { BuildIndicatorsNarrativeInputService } from '../../services/build-indicators-narrative-input.service';
import {
  buildIndicatorsNarrativeScopeKey,
  IndicatorsNarrativeDiagnosticScope,
  normalizeIndicatorsNarrativeDiagnosticScope,
} from '../../shared/indicators-narrative-diagnostic-scope.types';
import { resolveIndicatorsNarrativeDiagnosticModel } from '../../constants/resolve-indicators-narrative-diagnostic-model';
import { IGenerateIndicatorsNarrativeDiagnosticUseCase } from './generate-indicators-narrative-diagnostic.types';

const PROCESSING_STALE_MS = 60 * 60 * 1000;

@Injectable()
export class GenerateIndicatorsNarrativeDiagnosticUseCase {
  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly prisma: PrismaServiceV2,
    private readonly repository: FormIndicatorsNarrativeDiagnosticRepository,
    private readonly buildIndicatorsNarrativeInputService: BuildIndicatorsNarrativeInputService,
    private readonly systemAiPromptResolver: SystemAiPromptResolverService,
  ) {}

  async execute(
    params: IGenerateIndicatorsNarrativeDiagnosticUseCase.Params,
  ): Promise<IGenerateIndicatorsNarrativeDiagnosticUseCase.Result> {
    const user = this.context.get<UserContext>(ContextKey.USER);
    const isSystemMaster = user.isAdmin;

    if (!isSystemMaster && params.customPrompt?.trim()) {
      throw new ForbiddenException('Apenas usuários master do sistema podem enviar prompt personalizado.');
    }

    if (!isSystemMaster && params.model) {
      throw new ForbiddenException('Apenas usuários master do sistema podem selecionar o modelo de IA.');
    }

    const scope: IndicatorsNarrativeDiagnosticScope =
      normalizeIndicatorsNarrativeDiagnosticScope(params.scope);

    const promptKeyForScope = scope.showOnlyGroupIndicators
      ? SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_ONLY
      : SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_AND_QUESTIONS;

    const scopeKey = buildIndicatorsNarrativeScopeKey(scope);
    const existing = await this.repository.findByApplicationAndScope(
      params.formApplicationId,
      scopeKey,
    );

    if (existing?.status === FormAiAnalysisStatusEnum.PROCESSING) {
      const isStale = Date.now() - existing.updated_at.getTime() > PROCESSING_STALE_MS;
      if (!isStale) {
        throw new ConflictException(
          'Já existe um diagnóstico narrativo em processamento para este recorte.',
        );
      }
    }

    if (
      existing?.status === FormAiAnalysisStatusEnum.DONE &&
      existing.contentMarkdown?.trim() &&
      !params.regenerate
    ) {
      throw new ConflictException(
        'Já existe um diagnóstico narrativo salvo para este recorte. Envie regenerate=true para regerar.',
      );
    }

    // Prioriza a key específica do modo; mantém a antiga como fallback temporário.
    let resolvedPrompt = await this.systemAiPromptResolver.resolvePromptWithMeta(
      promptKeyForScope,
      isSystemMaster ? params.customPrompt : undefined,
    );

    if (!resolvedPrompt.content?.trim()) {
      resolvedPrompt = await this.systemAiPromptResolver.resolvePromptWithMeta(
        SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_DIAGNOSTIC,
        isSystemMaster ? params.customPrompt : undefined,
      );
    }

    if (!resolvedPrompt.content?.trim()) {
      throw new BadRequestException('Prompt de diagnóstico narrativo de indicadores não configurado.');
    }

    const formApplication = await this.prisma.formApplication.findFirst({
      where: { id: params.formApplicationId },
      select: {
        id: true,
        name: true,
        form: { select: { name: true } },
      },
    });

    if (!formApplication) {
      throw new BadRequestException('Aplicação de formulário não encontrada.');
    }

    const effectiveModel = resolveIndicatorsNarrativeDiagnosticModel(
      isSystemMaster ? params.model : undefined,
    );

    const processingRecord = await this.repository.upsertProcessing({
      companyId: params.companyId,
      formApplicationId: params.formApplicationId,
      scopeKey,
      scope,
      model: effectiveModel,
      generatedBy: user.id,
      metadata: {
        promptKey: promptKeyForScope,
        promptSource: resolvedPrompt.source,
        promptRevision: resolvedPrompt.revision ?? null,
        regenerate: Boolean(params.regenerate),
        modelSource: params.model?.trim()
          ? 'request'
          : process.env.OPENAI_INDICATORS_NARRATIVE_MODEL?.trim()
            ? 'env'
            : 'default',
      },
    });

    console.log('[Indicators Narrative Diagnostic] Queued', {
      formApplicationId: params.formApplicationId,
      scopeKey,
      promptSource: resolvedPrompt.source,
      promptLength: resolvedPrompt.content.length,
      model: effectiveModel,
    });

    void this.runInBackground({
      companyId: params.companyId,
      formApplicationId: params.formApplicationId,
      scopeKey,
      scope,
      promptKey: promptKeyForScope,
      analysisPrompt: resolvedPrompt.content,
      promptMeta: resolvedPrompt,
      model: effectiveModel,
      formApplicationName: formApplication.name,
      formModelName: formApplication.form?.name,
    }).catch((error) => {
      console.error('[Indicators Narrative Diagnostic] Background unhandled rejection:', error);
    });

    return this.mapRecord(processingRecord, true);
  }

  private async runInBackground(params: {
    companyId: string;
    formApplicationId: string;
    scopeKey: string;
    scope: IndicatorsNarrativeDiagnosticScope;
    promptKey: SystemAiPromptKeyEnum;
    analysisPrompt: string;
    promptMeta: { source: string; revision?: number };
    model?: string;
    formApplicationName: string;
    formModelName?: string;
  }): Promise<void> {
    const startTime = Date.now();

    try {
      const input = await this.buildIndicatorsNarrativeInputService.build({
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
        scope: params.scope,
        formApplicationName: params.formApplicationName,
        formModelName: params.formModelName,
      });

      if (input.summary.formGroupCount === 0 || input.summary.visibleIndicatorRows === 0) {
        throw new BadRequestException(
          'Não há indicadores calculáveis no recorte informado para gerar o diagnóstico narrativo.',
        );
      }

      console.log('[Indicators Narrative Diagnostic] Input built', {
        formApplicationId: params.formApplicationId,
        scopeKey: params.scopeKey,
        formGroupCount: input.summary.formGroupCount,
        visibleIndicatorRows: input.summary.visibleIndicatorRows,
      });

      const result = await Promise.race([
        this.aiAdapter.analyze({
          content: input.content,
          prompt: params.analysisPrompt,
          language: 'pt-BR',
          responseFormat: 'text',
          systemPrompt:
            'Você redige diagnósticos técnicos em Markdown sobre indicadores de qualidade das respostas. Não recalcule percentuais fornecidos pelo SimpleSST. Não trate os dados como matriz de risco ocupacional.',
          model: params.model,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Indicators narrative diagnostic timeout')),
            20 * 60 * 1000,
          ),
        ),
      ]);

      const markdown = result.analysis?.trim();
      if (!markdown) {
        throw new Error('A IA retornou conteúdo vazio para o diagnóstico narrativo.');
      }

      const processingTimeMs = Date.now() - startTime;

      await this.repository.updateDone({
        formApplicationId: params.formApplicationId,
        scopeKey: params.scopeKey,
        contentMarkdown: markdown,
        model: params.model,
        processingTimeMs,
        metadata: {
          promptKey: params.promptKey,
          promptSource: params.promptMeta.source,
          promptRevision: params.promptMeta.revision ?? null,
          inputSummary: input.summary,
          confidence: result.confidence,
        },
      });

      console.log('[Indicators Narrative Diagnostic] Completed', {
        formApplicationId: params.formApplicationId,
        scopeKey: params.scopeKey,
        processingTimeMs,
        contentLength: markdown.length,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Indicators Narrative Diagnostic] Failed', {
        formApplicationId: params.formApplicationId,
        scopeKey: params.scopeKey,
        error: errorMessage.slice(0, 300),
      });

      await this.repository.updateFailed({
        formApplicationId: params.formApplicationId,
        scopeKey: params.scopeKey,
        error: errorMessage,
      });
    }
  }

  private mapRecord(
    record: {
      id: string;
      formApplicationId: string;
      scopeKey: string;
      scope: unknown;
      status: FormAiAnalysisStatusEnum;
      contentMarkdown: string | null;
      metadata: unknown;
      model: string | null;
      created_at: Date;
      updated_at: Date;
    },
    analysesQueued: boolean,
  ): IGenerateIndicatorsNarrativeDiagnosticUseCase.Result {
    return {
      id: record.id,
      formApplicationId: record.formApplicationId,
      scopeKey: record.scopeKey,
      scope: record.scope as IndicatorsNarrativeDiagnosticScope,
      status: record.status,
      contentMarkdown: record.contentMarkdown,
      metadata: (record.metadata as Record<string, unknown>) ?? undefined,
      model: record.model,
      createdAt: record.created_at.toISOString(),
      updatedAt: record.updated_at.toISOString(),
      analysesQueued,
    };
  }
}
