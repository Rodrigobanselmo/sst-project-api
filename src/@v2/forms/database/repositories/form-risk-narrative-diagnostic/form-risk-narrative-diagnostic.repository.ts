import { Injectable } from '@nestjs/common';
import { FormAiAnalysisStatusEnum, Prisma } from '@prisma/client';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { RiskNarrativeDiagnosticScope } from '@/@v2/forms/application/form-questions-answers/risk-narrative-diagnostic/shared/risk-narrative-diagnostic-scope.types';

@Injectable()
export class FormRiskNarrativeDiagnosticRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  findByApplicationAndScope(formApplicationId: string, scopeKey: string) {
    return this.prisma.formRiskNarrativeDiagnostic.findUnique({
      where: {
        formApplicationId_scopeKey: {
          formApplicationId,
          scopeKey,
        },
      },
    });
  }

  async upsertProcessing(params: {
    companyId: string;
    formApplicationId: string;
    scopeKey: string;
    scope: RiskNarrativeDiagnosticScope;
    model?: string;
    generatedBy?: number;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.formRiskNarrativeDiagnostic.upsert({
      where: {
        formApplicationId_scopeKey: {
          formApplicationId: params.formApplicationId,
          scopeKey: params.scopeKey,
        },
      },
      create: {
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
        scopeKey: params.scopeKey,
        scope: params.scope as Prisma.InputJsonValue,
        status: FormAiAnalysisStatusEnum.PROCESSING,
        contentMarkdown: null,
        model: params.model,
        generatedBy: params.generatedBy,
        metadata: (params.metadata ?? { startedAt: new Date().toISOString() }) as Prisma.InputJsonValue,
      },
      update: {
        status: FormAiAnalysisStatusEnum.PROCESSING,
        contentMarkdown: null,
        model: params.model,
        generatedBy: params.generatedBy,
        scope: params.scope as Prisma.InputJsonValue,
        metadata: (params.metadata ?? { startedAt: new Date().toISOString() }) as Prisma.InputJsonValue,
        processingTimeMs: null,
        updated_at: new Date(),
      },
    });
  }

  updateDone(params: {
    formApplicationId: string;
    scopeKey: string;
    contentMarkdown: string;
    model?: string;
    processingTimeMs: number;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.formRiskNarrativeDiagnostic.update({
      where: {
        formApplicationId_scopeKey: {
          formApplicationId: params.formApplicationId,
          scopeKey: params.scopeKey,
        },
      },
      data: {
        status: FormAiAnalysisStatusEnum.DONE,
        contentMarkdown: params.contentMarkdown,
        model: params.model,
        processingTimeMs: params.processingTimeMs,
        metadata: params.metadata as Prisma.InputJsonValue,
        updated_at: new Date(),
      },
    });
  }

  updateFailed(params: {
    formApplicationId: string;
    scopeKey: string;
    error: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.formRiskNarrativeDiagnostic.update({
      where: {
        formApplicationId_scopeKey: {
          formApplicationId: params.formApplicationId,
          scopeKey: params.scopeKey,
        },
      },
      data: {
        status: FormAiAnalysisStatusEnum.FAILED,
        contentMarkdown: null,
        metadata: {
          ...(params.metadata ?? {}),
          error: params.error,
          failedAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
        updated_at: new Date(),
      },
    });
  }
}
