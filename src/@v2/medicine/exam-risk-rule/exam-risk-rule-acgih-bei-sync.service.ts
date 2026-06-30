import { Injectable } from '@nestjs/common';
import {
  PcmsoExamRiskRuleReferenceSourceEnum,
  PcmsoExamRiskRuleReferenceStatusEnum,
  PcmsoExamRiskRuleSourceEnum,
  Prisma,
} from '@prisma/client';

import { ExamRiskRuleReferenceRepository } from '../exam-risk-rule-reference/exam-risk-rule-reference.repository';
import {
  AcgihIndicatorWithLinks,
  AcgihRuleData,
  buildAcgihRuleData,
} from './exam-risk-rule-acgih-bei.mapper';
import { ExamRiskRuleRepository } from './exam-risk-rule.repository';
import { Nr07RuleExamData } from './exam-risk-rule-nr07.mapper';

export type AcgihSyncAction =
  | 'ruleCreated'
  | 'referenceCreated'
  | 'alreadySynced'
  | 'blocked'
  | 'failed';

export type AcgihSyncItemResult = {
  indicatorId: string;
  substanceName: string;
  riskFactorId?: string;
  riskName?: string;
  examId?: number;
  examName?: string;
  action: AcgihSyncAction;
  reason?: string;
  ruleId?: string;
  referenceId?: string;
};

export type AcgihSyncTotals = {
  indicators: number;
  eligible: number;
  rulesCreated: number;
  referencesCreated: number;
  alreadySynced: number;
  blocked: number;
  failed: number;
};

export type AcgihSyncResponse = {
  dryRun: boolean;
  totals: AcgihSyncTotals;
  items: AcgihSyncItemResult[];
};

const examToCreateInput = (
  exam: Nr07RuleExamData,
): Prisma.PcmsoExamRiskRuleExamCreateManyRuleInput => ({
  examId: exam.examId,
  examNameSnapshot: exam.examNameSnapshot,
  isAdmission: exam.isAdmission,
  isPeriodic: exam.isPeriodic,
  isChange: exam.isChange,
  isReturn: exam.isReturn,
  isDismissal: exam.isDismissal,
  isMale: exam.isMale,
  isFemale: exam.isFemale,
  validityInMonths: exam.validityInMonths,
  considerBetweenDays: exam.considerBetweenDays,
  fromAge: exam.fromAge,
  toAge: exam.toAge,
  minRiskDegree: exam.minRiskDegree,
  minRiskDegreeQuantity: exam.minRiskDegreeQuantity,
  collectionToleranceDays: exam.collectionToleranceDays,
  collectionMoment: exam.collectionMoment,
});

const isUniqueViolation = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

type ExistingRule = NonNullable<
  Awaited<ReturnType<ExamRiskRuleRepository['findRuleBySourceAndIndicator']>>
>;

/**
 * Sincroniza indicadores ACGIH/BEI consolidados com a Biblioteca Risco × Exame.
 *
 * Por cada par (indicador, vínculo de risco confirmado):
 * - se existe regra NR-07 equivalente (mesmo agente=risco + exame) → anexa
 *   referência ACGIH_BEI (não altera status da NR-7);
 * - senão → cria/atualiza regra própria source=TECHNICAL (agente=risco);
 * - bloqueia se faltar exame vinculado ao indicador.
 *
 * Não altera NR-7 (exceto referência complementar), RiskFactor, indicadores,
 * empresas, ExamToRisk nem PGR.
 */
@Injectable()
export class ExamRiskRuleAcgihBeiSyncService {
  constructor(
    private readonly ruleRepository: ExamRiskRuleRepository,
    private readonly referenceRepository: ExamRiskRuleReferenceRepository,
  ) {}

  async sync(params: {
    userId: number;
    dryRun?: boolean;
  }): Promise<AcgihSyncResponse> {
    const dryRun = params.dryRun === true;
    const indicators =
      (await this.ruleRepository.findAcgihIndicatorsForSync()) as AcgihIndicatorWithLinks[];

    const items: AcgihSyncItemResult[] = [];

    for (const indicator of indicators) {
      const confirmedRisks = indicator.riskLinks.filter(
        (l) => !l.deleted_at && l.isConfirmed,
      );
      const defaultExam = this.resolveDefaultExamLink(indicator);

      if (!defaultExam) {
        items.push({
          indicatorId: indicator.id,
          substanceName: indicator.substanceName,
          action: 'blocked',
          reason: 'Sem exame vinculado ao indicador ACGIH/BEI',
        });
        continue;
      }

      if (!confirmedRisks.length) {
        items.push({
          indicatorId: indicator.id,
          substanceName: indicator.substanceName,
          examId: defaultExam.examId ?? undefined,
          examName:
            defaultExam.exam?.name ??
            defaultExam.examNameSnapshot ??
            undefined,
          action: 'blocked',
          reason: 'Sem vínculo confirmado com Fator de Risco',
        });
        continue;
      }

      for (const riskLink of confirmedRisks) {
        const result = await this.syncOneTuple({
          indicator,
          riskLink,
          examLink: defaultExam,
          confirmedRiskCount: confirmedRisks.length,
          userId: params.userId,
          dryRun,
        });
        items.push(result);
      }
    }

    return {
      dryRun,
      totals: this.buildTotals(indicators.length, items),
      items,
    };
  }

  private resolveDefaultExamLink(indicator: AcgihIndicatorWithLinks) {
    const confirmed = indicator.examLinks.filter(
      (l) => !l.deleted_at && l.isConfirmed,
    );
    if (!confirmed.length) return null;
    if (confirmed.length === 1) return confirmed[0];
    return confirmed.find((l) => l.isDefault) ?? confirmed[0];
  }

  private async syncOneTuple(params: {
    indicator: AcgihIndicatorWithLinks;
    riskLink: AcgihIndicatorWithLinks['riskLinks'][number];
    examLink: AcgihIndicatorWithLinks['examLinks'][number];
    confirmedRiskCount: number;
    userId: number;
    dryRun: boolean;
  }): Promise<AcgihSyncItemResult> {
    const { indicator, riskLink, examLink, confirmedRiskCount, userId, dryRun } =
      params;

    const base = {
      indicatorId: indicator.id,
      substanceName: indicator.substanceName,
      riskFactorId: riskLink.riskFactorId,
      riskName: riskLink.riskFactor?.name ?? undefined,
      examId: examLink.examId ?? undefined,
      examName:
        examLink.exam?.name ?? examLink.examNameSnapshot ?? undefined,
    };

    if (!examLink.examId) {
      return {
        ...base,
        action: 'blocked',
        reason: 'Sem exame vinculado ao indicador ACGIH/BEI',
      };
    }

    const ruleData = buildAcgihRuleData({
      indicator,
      riskLink,
      examLink,
      confirmedRiskCount,
    });

    try {
      const nr07Rule = await this.ruleRepository.findNr07RuleByAgentAndExam({
        agentNameNormalized: ruleData.agentNameNormalized,
        examId: examLink.examId,
      });

      if (nr07Rule) {
        return await this.attachReference({
          ...base,
          targetRuleId: nr07Rule.id,
          acgihBeiIndicatorId: indicator.acgihBeiIndicatorId!,
          indicator,
          userId,
          dryRun,
        });
      }

      return await this.upsertOwnRule({
        ...base,
        ruleData,
        userId,
        dryRun,
      });
    } catch (error) {
      return {
        ...base,
        action: 'failed',
        reason:
          error instanceof Error ? error.message : 'Erro desconhecido ao sincronizar',
      };
    }
  }

  private async attachReference(params: {
    indicatorId: string;
    substanceName: string;
    riskFactorId: string;
    riskName?: string;
    examId?: number;
    examName?: string;
    targetRuleId: string;
    acgihBeiIndicatorId: string;
    indicator: AcgihIndicatorWithLinks;
    userId: number;
    dryRun: boolean;
  }): Promise<AcgihSyncItemResult> {
    const base = {
      indicatorId: params.indicatorId,
      substanceName: params.substanceName,
      riskFactorId: params.riskFactorId,
      riskName: params.riskName,
      examId: params.examId,
      examName: params.examName,
      ruleId: params.targetRuleId,
    };

    const existing = await this.referenceRepository.findRawByRuleAndAcgih(
      params.targetRuleId,
      params.acgihBeiIndicatorId,
    );

    if (
      existing &&
      !existing.deleted_at &&
      existing.status === PcmsoExamRiskRuleReferenceStatusEnum.ACTIVE
    ) {
      return {
        ...base,
        action: 'alreadySynced',
        referenceId: existing.id,
      };
    }

    if (params.dryRun) {
      return {
        ...base,
        action: existing ? 'referenceCreated' : 'referenceCreated',
        reason: 'Simulação (dryRun)',
      };
    }

    const referenceLabel = this.buildReferenceLabel(params.indicator);
    const referenceYear = this.parseNormativeYear(params.indicator.normativeVersion);

    if (existing) {
      const restored = await this.referenceRepository.update(existing.id, {
        status: PcmsoExamRiskRuleReferenceStatusEnum.ACTIVE,
        deleted_at: null,
        deletedById: null,
        updatedById: params.userId,
        referenceLabel,
        referenceYear,
      });
      return {
        ...base,
        action: 'referenceCreated',
        referenceId: restored.id,
      };
    }

    try {
      const created = await this.referenceRepository.create({
        rule: { connect: { id: params.targetRuleId } },
        sourceType: PcmsoExamRiskRuleReferenceSourceEnum.ACGIH_BEI,
        acgihBeiIndicator: { connect: { id: params.acgihBeiIndicatorId } },
        referenceLabel,
        referenceYear,
        status: PcmsoExamRiskRuleReferenceStatusEnum.ACTIVE,
        createdById: params.userId,
      });
      return {
        ...base,
        action: 'referenceCreated',
        referenceId: created.id,
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        const after = await this.referenceRepository.findRawByRuleAndAcgih(
          params.targetRuleId,
          params.acgihBeiIndicatorId,
        );
        if (after) {
          return {
            ...base,
            action: 'alreadySynced',
            referenceId: after.id,
          };
        }
      }
      throw error;
    }
  }

  private async upsertOwnRule(params: {
    indicatorId: string;
    substanceName: string;
    riskFactorId: string;
    riskName?: string;
    examId?: number;
    examName?: string;
    ruleData: AcgihRuleData;
    userId: number;
    dryRun: boolean;
  }): Promise<AcgihSyncItemResult> {
    const base = {
      indicatorId: params.indicatorId,
      substanceName: params.substanceName,
      riskFactorId: params.riskFactorId,
      riskName: params.riskName,
      examId: params.examId,
      examName: params.examName,
    };

    const existing = await this.ruleRepository.findRuleBySourceAndIndicator(
      PcmsoExamRiskRuleSourceEnum.TECHNICAL,
      params.ruleData.sourceIndicatorId,
    );

    if (existing?.isCurated) {
      return {
        ...base,
        ruleId: existing.id,
        action: 'alreadySynced',
        reason: 'Regra curada manualmente — sync não sobrescreve',
      };
    }

    if (existing && this.isUpToDate(existing, params.ruleData)) {
      return {
        ...base,
        ruleId: existing.id,
        action: 'alreadySynced',
      };
    }

    if (params.dryRun) {
      return {
        ...base,
        action: existing ? 'ruleCreated' : 'ruleCreated',
        reason: 'Simulação (dryRun)',
      };
    }

    if (!existing) {
      const created = await this.ruleRepository.create(
        this.buildCreateInput(params.ruleData),
      );
      return {
        ...base,
        ruleId: created.id,
        action: 'ruleCreated',
      };
    }

    const updated = await this.ruleRepository.update(
      existing.id,
      this.buildUpdateInput(params.ruleData),
      params.ruleData.exam
        ? [examToCreateInput(params.ruleData.exam)]
        : [],
    );
    return {
      ...base,
      ruleId: updated.id,
      action: 'ruleCreated',
      reason: 'Regra técnica ACGIH/BEI atualizada',
    };
  }

  private buildCreateInput(
    data: AcgihRuleData,
  ): Prisma.PcmsoExamRiskRuleCreateInput {
    return {
      scope: data.scope,
      source: data.source,
      sourceIndicatorId: data.sourceIndicatorId,
      status: data.status,
      rationale: data.rationale,
      agentCas: data.agentCas,
      agentName: data.agentName,
      agentNameNormalized: data.agentNameNormalized,
      riskNameSnapshot: data.riskNameSnapshot,
      isCurated: false,
      ...(data.exam
        ? { exams: { createMany: { data: [examToCreateInput(data.exam)] } } }
        : {}),
    };
  }

  private buildUpdateInput(
    data: AcgihRuleData,
  ): Prisma.PcmsoExamRiskRuleUpdateInput {
    return {
      scope: data.scope,
      source: data.source,
      status: data.status,
      rationale: data.rationale,
      agentCas: data.agentCas,
      agentName: data.agentName,
      agentNameNormalized: data.agentNameNormalized,
      riskNameSnapshot: data.riskNameSnapshot,
    };
  }

  private isUpToDate(existing: ExistingRule, data: AcgihRuleData): boolean {
    const ruleSame =
      existing.scope === data.scope &&
      existing.status === data.status &&
      existing.agentCas === data.agentCas &&
      existing.agentName === data.agentName &&
      existing.agentNameNormalized === data.agentNameNormalized &&
      existing.riskNameSnapshot === data.riskNameSnapshot &&
      existing.rationale === data.rationale;

    if (!ruleSame) return false;

    const existingExam = existing.exams?.[0] ?? null;
    if (!existingExam && !data.exam) return true;
    if (!existingExam || !data.exam) return false;

    return (
      existingExam.examId === data.exam.examId &&
      existingExam.collectionMoment === data.exam.collectionMoment
    );
  }

  private buildReferenceLabel(indicator: AcgihIndicatorWithLinks): string {
    const year = this.parseNormativeYear(indicator.normativeVersion);
    const detail = [
      indicator.biologicalIndicatorOriginal,
      indicator.biologicalMatrix,
    ]
      .filter((v): v is string => !!v?.trim())
      .join(', ');
    const base = `ACGIH/BEI${year ? ` ${year}` : ''} — ${indicator.substanceName}`;
    return detail ? `${base} (${detail})` : base;
  }

  private parseNormativeYear(normativeVersion: string | null): number | null {
    if (!normativeVersion) return null;
    const match = normativeVersion.match(/(\d{4})/);
    return match ? Number(match[1]) : null;
  }

  private buildTotals(
    indicatorCount: number,
    items: AcgihSyncItemResult[],
  ): AcgihSyncTotals {
    return {
      indicators: indicatorCount,
      eligible: items.filter(
        (i) =>
          i.action === 'ruleCreated' ||
          i.action === 'referenceCreated' ||
          i.action === 'alreadySynced',
      ).length,
      rulesCreated: items.filter((i) => i.action === 'ruleCreated').length,
      referencesCreated: items.filter((i) => i.action === 'referenceCreated')
        .length,
      alreadySynced: items.filter((i) => i.action === 'alreadySynced').length,
      blocked: items.filter((i) => i.action === 'blocked').length,
      failed: items.filter((i) => i.action === 'failed').length,
    };
  }
}
