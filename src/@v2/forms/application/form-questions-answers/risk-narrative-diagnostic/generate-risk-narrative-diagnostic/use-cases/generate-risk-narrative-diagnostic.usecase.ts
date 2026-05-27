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
import { FormRiskNarrativeDiagnosticRepository } from '@/@v2/forms/database/repositories/form-risk-narrative-diagnostic/form-risk-narrative-diagnostic.repository';
import { BuildRiskNarrativeInputService } from '../../services/build-risk-narrative-input.service';
import {
  buildRiskNarrativeScopeKey,
  RiskNarrativeDiagnosticScope,
} from '../../shared/risk-narrative-diagnostic-scope.types';
import { resolveRiskNarrativeDiagnosticModel } from '../../constants/resolve-risk-narrative-diagnostic-model';
import { IGenerateRiskNarrativeDiagnosticUseCase } from './generate-risk-narrative-diagnostic.types';

const PROCESSING_STALE_MS = 60 * 60 * 1000;

@Injectable()
export class GenerateRiskNarrativeDiagnosticUseCase {
  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly prisma: PrismaServiceV2,
    private readonly repository: FormRiskNarrativeDiagnosticRepository,
    private readonly buildRiskNarrativeInputService: BuildRiskNarrativeInputService,
    private readonly systemAiPromptResolver: SystemAiPromptResolverService,
  ) {}

  async execute(
    params: IGenerateRiskNarrativeDiagnosticUseCase.Params,
  ): Promise<IGenerateRiskNarrativeDiagnosticUseCase.Result> {
    const user = this.context.get<UserContext>(ContextKey.USER);
    const isSystemMaster = user.isAdmin;

    if (!isSystemMaster && params.customPrompt?.trim()) {
      throw new ForbiddenException('Apenas usuários master do sistema podem enviar prompt personalizado.');
    }

    if (!isSystemMaster && params.model) {
      throw new ForbiddenException('Apenas usuários master do sistema podem selecionar o modelo de IA.');
    }

    const scope: RiskNarrativeDiagnosticScope = {
      groupingQuestionId: params.scope.groupingQuestionId ?? null,
      participantGroupIds: params.scope.participantGroupIds ?? [],
      allowedHierarchyIds: params.scope.allowedHierarchyIds ?? null,
      groupingLabel: params.scope.groupingLabel ?? null,
    };

    const scopeKey = buildRiskNarrativeScopeKey(scope);
    const existing = await this.repository.findByApplicationAndScope(
      params.formApplicationId,
      scopeKey,
    );

    if (existing?.status === FormAiAnalysisStatusEnum.PROCESSING) {
      const isStale = Date.now() - existing.updated_at.getTime() > PROCESSING_STALE_MS;
      if (!isStale) {
        throw new ConflictException('Já existe um diagnóstico narrativo em processamento para este recorte.');
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

    const resolvedPrompt = await this.systemAiPromptResolver.resolvePromptWithMeta(
      SystemAiPromptKeyEnum.RISK_NARRATIVE_DIAGNOSTIC,
      isSystemMaster ? params.customPrompt : undefined,
    );

    if (!resolvedPrompt.content?.trim()) {
      throw new BadRequestException('Prompt de diagnóstico narrativo não configurado.');
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

    const effectiveModel = resolveRiskNarrativeDiagnosticModel(
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
        promptKey: SystemAiPromptKeyEnum.RISK_NARRATIVE_DIAGNOSTIC,
        promptSource: resolvedPrompt.source,
        promptRevision: resolvedPrompt.revision ?? null,
        regenerate: Boolean(params.regenerate),
        modelSource: params.model?.trim()
          ? 'request'
          : process.env.OPENAI_RISK_NARRATIVE_MODEL?.trim()
            ? 'env'
            : 'default',
      },
    });

    console.log('[Risk Narrative Diagnostic] Queued', {
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
      analysisPrompt: resolvedPrompt.content,
      promptMeta: resolvedPrompt,
      model: effectiveModel,
      formApplicationName: formApplication.name,
      formModelName: formApplication.form?.name,
    }).catch((error) => {
      console.error('[Risk Narrative Diagnostic] Background unhandled rejection:', error);
    });

    return this.mapRecord(processingRecord, true);
  }

  private async runInBackground(params: {
    companyId: string;
    formApplicationId: string;
    scopeKey: string;
    scope: RiskNarrativeDiagnosticScope;
    analysisPrompt: string;
    promptMeta: { source: string; revision?: number };
    model?: string;
    formApplicationName: string;
    formModelName?: string;
  }): Promise<void> {
    const startTime = Date.now();

    try {
      const input = await this.buildRiskNarrativeInputService.build({
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
        scope: params.scope,
        formApplicationName: params.formApplicationName,
        formModelName: params.formModelName,
      });

      if (input.summary.totalRiskSectorPairs === 0) {
        throw new BadRequestException(
          'Não há dados de risco×setor no recorte informado para gerar o diagnóstico narrativo.',
        );
      }

      console.log('[Risk Narrative Diagnostic] Input built', {
        formApplicationId: params.formApplicationId,
        scopeKey: params.scopeKey,
        totalRiskSectorPairs: input.summary.totalRiskSectorPairs,
        distinctRisks: input.summary.distinctRisks,
        distinctSectors: input.summary.distinctSectors,
      });

      const result = await Promise.race([
        this.aiAdapter.analyze({
          content: input.content,
          prompt: params.analysisPrompt,
          language: 'pt-BR',
          responseFormat: 'text',
          systemPrompt:
            'Você redige diagnósticos técnicos em Markdown para profissionais de SST. Não recalcule métricas fornecidas pelo SimpleSST.',
          model: params.model,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Risk narrative diagnostic timeout')), 20 * 60 * 1000),
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
          promptKey: SystemAiPromptKeyEnum.RISK_NARRATIVE_DIAGNOSTIC,
          promptSource: params.promptMeta.source,
          promptRevision: params.promptMeta.revision ?? null,
          inputSummary: input.summary,
          confidence: result.confidence,
        },
      });

      console.log('[Risk Narrative Diagnostic] Completed', {
        formApplicationId: params.formApplicationId,
        scopeKey: params.scopeKey,
        processingTimeMs,
        contentLength: markdown.length,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Risk Narrative Diagnostic] Failed', {
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
  ): IGenerateRiskNarrativeDiagnosticUseCase.Result {
    return {
      id: record.id,
      formApplicationId: record.formApplicationId,
      scopeKey: record.scopeKey,
      scope: record.scope as RiskNarrativeDiagnosticScope,
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
