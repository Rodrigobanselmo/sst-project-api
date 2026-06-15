import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FormAiAnalysisStatusEnum } from '@prisma/client';

import { resolveRiskNarrativeDiagnosticModel } from '@/@v2/forms/application/form-questions-answers/risk-narrative-diagnostic/constants/resolve-risk-narrative-diagnostic-model';
import { SystemAiPromptKeyEnum } from '@/@v2/forms/application/system-ai-prompt/constants/system-ai-prompt-key.enum';
import { SystemAiPromptResolverService } from '@/@v2/forms/application/system-ai-prompt/services/system-ai-prompt-resolver.service';
import { FormRiskNarrativeDiagnosticRepository } from '@/@v2/forms/database/repositories/form-risk-narrative-diagnostic/form-risk-narrative-diagnostic.repository';
import { AiAdapter } from '@/@v2/shared/adapters/ai/ai.interface';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { BuildConsolidatedRiskNarrativeInputService } from './build-consolidated-risk-narrative-input.service';
import { CompanyGroupConsolidatedViewContextService } from './company-group-consolidated-view-context.service';
import { CompanyGroupConsolidatedViewRiskAnalysisService } from './company-group-consolidated-view-risk-analysis.service';
import {
  buildConsolidatedRiskNarrativeScopeKey,
  ConsolidatedRiskNarrativeScope,
  getConsolidatedRiskNarrativeStorageAnchor,
  normalizeConsolidatedRiskNarrativeScope,
} from '../utils/consolidated-risk-narrative-scope.types';

const PROCESSING_STALE_MS = 60 * 60 * 1000;

const CONSOLIDATED_RISK_NARRATIVE_SYSTEM_PROMPT = `Você redige diagnósticos narrativos executivos em Markdown sobre análise de riscos psicossociais consolidada de um grupo empresarial.

Considere exclusivamente as análises de risco já existentes nas aplicações individuais consolidadas. Não crie novos riscos, fontes geradoras, recomendações operacionais, probabilidades, severidades, níveis de risco, ações de inventário ou ações de PGR. Produza apenas uma síntese executiva gerencial do conjunto consolidado.

Use linguagem gerencial e interpretativa, não operacional-prescritiva. Evite instruir implementação de EPC, EPI, inclusão em PGR/inventário, criação de fontes geradoras ou execução de planos de ação. Prefira observações como recorrência, concentração por empresa/unidade/setor, fatores mais recorrentes e limitações da consolidação virtual.

Não recalcule probabilidade, severidade ou NRO. Não invente setores, empresas ou fatores ausentes dos dados.`;

export type ConsolidatedRiskNarrativeDiagnosticResult = {
  id: string;
  mode: 'virtual_consolidated';
  businessGroupId: number;
  businessGroupName: string;
  applicationIds: string[];
  scopeKey: string;
  scope: ConsolidatedRiskNarrativeScope;
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
export class CompanyGroupConsolidatedViewRiskNarrativeDiagnosticService {
  constructor(
    @Inject(SharedTokens.AI)
    private readonly aiAdapter: AiAdapter,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly contextService: CompanyGroupConsolidatedViewContextService,
    private readonly riskAnalysisService: CompanyGroupConsolidatedViewRiskAnalysisService,
    private readonly buildInputService: BuildConsolidatedRiskNarrativeInputService,
    private readonly repository: FormRiskNarrativeDiagnosticRepository,
    private readonly systemAiPromptResolver: SystemAiPromptResolverService,
  ) {}

  async read(params: {
    companyGroupId: number;
    applicationIds?: string[];
    scopeKey?: string;
    scope: ConsolidatedRiskNarrativeScope;
    user: UserPayloadDto;
  }): Promise<ConsolidatedRiskNarrativeDiagnosticResult | null> {
    const context = await this.contextService.resolve({
      companyGroupId: params.companyGroupId,
      applicationIds: params.applicationIds,
      user: params.user,
    });

    const scope = normalizeConsolidatedRiskNarrativeScope(params.scope);
    const applicationIds = context.applications.map((app) => app.applicationId);
    const scopeKey =
      params.scopeKey?.trim() ||
      buildConsolidatedRiskNarrativeScopeKey({
        companyGroupId: context.companyGroupId,
        applicationIds,
        scope,
      });
    const storageApplicationId = getConsolidatedRiskNarrativeStorageAnchor({
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
    scope: ConsolidatedRiskNarrativeScope;
    customPrompt?: string;
    model?: string;
    regenerate?: boolean;
    user: UserPayloadDto;
  }): Promise<ConsolidatedRiskNarrativeDiagnosticResult> {
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

    const scope = normalizeConsolidatedRiskNarrativeScope(params.scope);
    const applicationIds = context.applications.map((app) => app.applicationId);
    const scopeKey = buildConsolidatedRiskNarrativeScopeKey({
      companyGroupId: context.companyGroupId,
      applicationIds,
      scope,
    });
    const storageApplicationId = getConsolidatedRiskNarrativeStorageAnchor({
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
          'Já existe um diagnóstico narrativo consolidado em processamento para este recorte.',
        );
      }
    }

    if (
      existing?.status === FormAiAnalysisStatusEnum.DONE &&
      existing.contentMarkdown?.trim() &&
      !params.regenerate
    ) {
      throw new ConflictException(
        'Já existe um diagnóstico narrativo consolidado salvo para este recorte. Envie regenerate=true para regerar.',
      );
    }

    const resolvedPrompt = await this.systemAiPromptResolver.resolvePromptWithMeta(
      SystemAiPromptKeyEnum.RISK_NARRATIVE_DIAGNOSTIC,
      isSystemMaster ? params.customPrompt : undefined,
    );

    if (!resolvedPrompt.content?.trim()) {
      throw new BadRequestException(
        'Prompt de narrativa consolidada de riscos não configurado.',
      );
    }

    const effectiveModel = resolveRiskNarrativeDiagnosticModel(
      isSystemMaster ? params.model : undefined,
    );

    const processingRecord = await this.repository.upsertProcessing({
      companyId: anchorCompanyId,
      formApplicationId: storageApplicationId,
      scopeKey,
      scope: scope as unknown as import('@/@v2/forms/application/form-questions-answers/risk-narrative-diagnostic/shared/risk-narrative-diagnostic-scope.types').RiskNarrativeDiagnosticScope,
      model: effectiveModel,
      generatedBy: user.id,
      metadata: {
        mode: 'virtual_consolidated',
        companyGroupId: context.companyGroupId,
        businessGroupName: context.companyGroupName,
        applicationIds,
        promptKey: SystemAiPromptKeyEnum.RISK_NARRATIVE_DIAGNOSTIC,
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
      analysisPrompt: resolvedPrompt.content,
      promptMeta: resolvedPrompt,
      model: effectiveModel,
    }).catch((error) => {
      console.error('[Consolidated Risk Narrative] Background unhandled rejection:', error);
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
    scope: ConsolidatedRiskNarrativeScope;
    storageApplicationId: string;
    analysisPrompt: string;
    promptMeta: { source: string; revision?: number };
    model?: string;
  }): Promise<void> {
    const startTime = Date.now();

    try {
      const listing = await this.riskAnalysisService.list({
        applications: params.context.applications,
      });

      const uniqueCompanies = new Set(
        params.context.applications.map((application) => application.companyId),
      );

      const input = this.buildInputService.build({
        items: listing.items,
        summary: listing.summary,
        scope: params.scope,
        businessGroupName: params.context.companyGroupName,
        applicationCount: params.context.applications.length,
        companyCount: uniqueCompanies.size,
      });

      if (input.summary.totalConsolidatedRecords === 0) {
        throw new BadRequestException(
          'Não há registros de análise de riscos neste recorte consolidado para gerar a narrativa.',
        );
      }

      const result = await Promise.race([
        this.aiAdapter.analyze({
          content: input.content,
          prompt: `${params.analysisPrompt}\n\nConsidere exclusivamente as análises de risco já existentes nas aplicações individuais consolidadas. Não crie novos riscos, fontes geradoras, recomendações operacionais, probabilidades, severidades, níveis de risco, ações de inventário ou ações de PGR. Produza apenas uma síntese executiva gerencial do conjunto consolidado.`,
          language: 'pt-BR',
          responseFormat: 'text',
          systemPrompt: CONSOLIDATED_RISK_NARRATIVE_SYSTEM_PROMPT,
          model: params.model,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Consolidated risk narrative timeout')),
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
          promptKey: SystemAiPromptKeyEnum.RISK_NARRATIVE_DIAGNOSTIC,
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
  ): ConsolidatedRiskNarrativeDiagnosticResult {
    const metadata = (record.metadata as Record<string, unknown>) ?? {};
    const scope =
      (metadata.consolidatedScope as ConsolidatedRiskNarrativeScope | undefined) ??
      normalizeConsolidatedRiskNarrativeScope(
        record.scope as ConsolidatedRiskNarrativeScope,
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
