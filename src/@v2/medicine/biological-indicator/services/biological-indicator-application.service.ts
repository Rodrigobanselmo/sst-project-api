import { Injectable } from '@nestjs/common';
import { BiologicalIndicatorStatusEnum } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { simpleCompanyId } from '@/shared/constants/ids';

import {
  ApplicationExamToRiskPayload,
  buildExamToRiskPayload,
  buildNormativeTraceability,
  compareExistingExamToRisk,
  ExamToRiskComparisonAction,
  validateApplicationEligibility,
} from './biological-indicator-application.eligibility';

export type BiologicalIndicatorApplicationPlannedAction =
  | ExamToRiskComparisonAction
  | 'BLOCKED';

export type BiologicalIndicatorApplicationItemPreview = {
  indicatorId: string;
  substanceName: string;
  tableNumber: string;
  indicatorType: string;
  status: BiologicalIndicatorStatusEnum;
  action: BiologicalIndicatorApplicationPlannedAction;
  blockCodes: string[];
  blockMessages: string[];
  conflictReasons: string[];
  existingExamToRiskId: number | null;
  payload: ApplicationExamToRiskPayload | null;
  normativeTraceability: ReturnType<typeof buildNormativeTraceability> | null;
  riskName: string | null;
  examName: string | null;
};

export type BiologicalIndicatorApplicationReport = {
  generatedAt: string;
  companyId: string;
  dryRun: boolean;
  applied: boolean;
  summary: {
    totalIndicators: number;
    activeIndicators: number;
    applicable: number;
    blocked: number;
    wouldCreate: number;
    wouldUpdate: number;
    wouldSkip: number;
    conflicts: number;
    created: number;
    updated: number;
    skipped: number;
    conflicted: number;
  };
  items: BiologicalIndicatorApplicationItemPreview[];
  blockedItems: BiologicalIndicatorApplicationItemPreview[];
  plannedActions: BiologicalIndicatorApplicationItemPreview[];
};

@Injectable()
export class BiologicalIndicatorApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async previewApplication(params?: { indicatorIds?: string[] }) {
    return this.runApplication({ ...params, dryRun: true, confirmApply: false });
  }

  async applyApplication(params: {
    indicatorIds?: string[];
    confirmApply: boolean;
    userId: number;
  }) {
    if (!params.confirmApply) {
      return this.runApplication({
        indicatorIds: params.indicatorIds,
        dryRun: true,
        confirmApply: false,
      });
    }

    return this.runApplication({
      indicatorIds: params.indicatorIds,
      dryRun: false,
      confirmApply: true,
      userId: params.userId,
    });
  }

  async validateApplicableIndicators(params?: { indicatorIds?: string[] }) {
    const preview = await this.previewApplication(params);
    return {
      applicable: preview.items.filter((item) => item.action !== 'BLOCKED'),
      blocked: preview.blockedItems,
      summary: preview.summary,
    };
  }

  generateApplicationReport(
    items: BiologicalIndicatorApplicationItemPreview[],
    options: {
      dryRun: boolean;
      applied: boolean;
      created: number;
      updated: number;
      skipped: number;
      conflicted: number;
    },
  ): BiologicalIndicatorApplicationReport {
    const activeIndicators = items.filter(
      (item) => item.status === BiologicalIndicatorStatusEnum.ACTIVE,
    ).length;
    const applicable = items.filter((item) => item.action !== 'BLOCKED').length;
    const blocked = items.filter((item) => item.action === 'BLOCKED').length;

    return {
      generatedAt: new Date().toISOString(),
      companyId: simpleCompanyId,
      dryRun: options.dryRun,
      applied: options.applied,
      summary: {
        totalIndicators: items.length,
        activeIndicators,
        applicable,
        blocked,
        wouldCreate: items.filter((item) => item.action === 'CREATE').length,
        wouldUpdate: items.filter((item) => item.action === 'UPDATE').length,
        wouldSkip: items.filter((item) => item.action === 'SKIP').length,
        conflicts: items.filter((item) => item.action === 'CONFLICT').length,
        created: options.created,
        updated: options.updated,
        skipped: options.skipped,
        conflicted: options.conflicted,
      },
      items,
      blockedItems: items.filter((item) => item.action === 'BLOCKED'),
      plannedActions: items.filter((item) =>
        ['CREATE', 'UPDATE', 'SKIP', 'CONFLICT'].includes(item.action),
      ),
    };
  }

  private async runApplication(params: {
    indicatorIds?: string[];
    dryRun: boolean;
    confirmApply: boolean;
    userId?: number;
  }): Promise<BiologicalIndicatorApplicationReport> {
    const indicators = await this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        ...(params.indicatorIds?.length ? { id: { in: params.indicatorIds } } : {}),
      },
      include: {
        riskLinks: {
          where: { deleted_at: null },
          include: {
            riskFactor: {
              select: { id: true, name: true, system: true, deleted_at: true },
            },
          },
        },
        examLinks: {
          where: { deleted_at: null },
          include: {
            exam: {
              select: { id: true, name: true, system: true, deleted_at: true },
            },
          },
        },
      },
      orderBy: [{ substanceName: 'asc' }, { biologicalIndicatorNormalized: 'asc' }],
    });

    const existingExamToRisks = await this.prisma.examToRisk.findMany({
      where: {
        companyId: simpleCompanyId,
        deletedAt: null,
      },
    });

    const existingByKey = new Map(
      existingExamToRisks.map((row) => [
        `${row.examId}:${row.riskId}:${row.companyId}`,
        row,
      ]),
    );

    const items: BiologicalIndicatorApplicationItemPreview[] = [];
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let conflicted = 0;

    for (const indicator of indicators) {
      const eligibility = validateApplicationEligibility(indicator);

      if (!eligibility.isEligible) {
        items.push({
          indicatorId: indicator.id,
          substanceName: indicator.substanceName,
          tableNumber: indicator.tableNumber,
          indicatorType: indicator.indicatorType,
          status: indicator.status,
          action: 'BLOCKED',
          blockCodes: eligibility.blockCodes,
          blockMessages: eligibility.messages,
          conflictReasons: [],
          existingExamToRiskId: null,
          payload: null,
          normativeTraceability: buildNormativeTraceability(indicator),
          riskName: eligibility.primaryRiskLink?.riskFactor?.name ?? null,
          examName: eligibility.defaultExamLink?.exam?.name ?? null,
        });
        continue;
      }

      const payload = buildExamToRiskPayload(indicator, eligibility, simpleCompanyId)!;
      const key = `${payload.examId}:${payload.riskId}:${payload.companyId}`;
      const existing = existingByKey.get(key) ?? null;
      const comparison = compareExistingExamToRisk(existing, payload);

      items.push({
        indicatorId: indicator.id,
        substanceName: indicator.substanceName,
        tableNumber: indicator.tableNumber,
        indicatorType: indicator.indicatorType,
        status: indicator.status,
        action: comparison.action,
        blockCodes: [],
        blockMessages: [],
        conflictReasons: comparison.conflictReasons,
        existingExamToRiskId: comparison.existingExamToRiskId,
        payload,
        normativeTraceability: buildNormativeTraceability(indicator),
        riskName: eligibility.primaryRiskLink?.riskFactor?.name ?? null,
        examName: eligibility.defaultExamLink?.exam?.name ?? null,
      });

      if (params.dryRun || !params.confirmApply) {
        continue;
      }

      if (comparison.action === 'CREATE') {
        const createdRow = await this.prisma.examToRisk.create({
          data: {
            ...payload,
            considerBetweenDays: null,
          },
        });
        existingByKey.set(key, createdRow);
        created += 1;
      } else if (comparison.action === 'UPDATE' && comparison.existingExamToRiskId) {
        await this.prisma.examToRisk.update({
          where: {
            id_companyId: {
              id: comparison.existingExamToRiskId,
              companyId: simpleCompanyId,
            },
          },
          data: comparison.fieldsToUpdate,
        });
        updated += 1;
      } else if (comparison.action === 'SKIP') {
        skipped += 1;
      } else if (comparison.action === 'CONFLICT') {
        conflicted += 1;
      }
    }

    return this.generateApplicationReport(items, {
      dryRun: params.dryRun || !params.confirmApply,
      applied: params.confirmApply && !params.dryRun,
      created,
      updated,
      skipped,
      conflicted,
    });
  }
}
