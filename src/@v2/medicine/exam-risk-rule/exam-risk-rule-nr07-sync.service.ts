import { Injectable } from '@nestjs/common';
import { Prisma, PcmsoExamRiskRuleStatusEnum } from '@prisma/client';

import {
  buildNr07RuleData,
  Nr07RuleData,
  Nr07RuleExamData,
} from './exam-risk-rule-nr07.mapper';
import { ExamRiskRuleRepository } from './exam-risk-rule.repository';

export type Nr07SyncSummary = {
  totalIndicators: number;
  /** Partição por desfecho da persistência (soma === totalIndicators). */
  created: number;
  updated: number;
  unchanged: number;
  curatedSkipped: number;
  /** Status resultante das regras não puladas (active + draft === created+updated+unchanged). */
  active: number;
  draft: number;
  /** Tally dos motivos de DRAFT (block codes) entre as regras não puladas. */
  draftReasons: Record<string, number>;
};

type ExistingRule = NonNullable<
  Awaited<ReturnType<ExamRiskRuleRepository['findRuleBySourceIndicator']>>
>;

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

@Injectable()
export class ExamRiskRuleNr07SyncService {
  constructor(private readonly repository: ExamRiskRuleRepository) {}

  async sync(): Promise<Nr07SyncSummary> {
    const indicators = await this.repository.findNr07IndicatorsForSync();

    const summary: Nr07SyncSummary = {
      totalIndicators: indicators.length,
      created: 0,
      updated: 0,
      unchanged: 0,
      curatedSkipped: 0,
      active: 0,
      draft: 0,
      draftReasons: {},
    };

    for (const indicator of indicators) {
      const data = buildNr07RuleData(indicator as never);

      const existing = await this.repository.findRuleBySourceIndicator(
        data.sourceIndicatorId,
      );

      // Preserva curadoria manual: não recomputa nem sobrescreve, e por isso
      // não entra na contagem de status (active/draft) deste run.
      if (existing?.isCurated) {
        summary.curatedSkipped += 1;
        continue;
      }

      if (!existing) {
        await this.repository.create(this.buildCreateInput(data));
        summary.created += 1;
      } else if (this.isUpToDate(existing, data)) {
        summary.unchanged += 1;
      } else {
        await this.repository.update(
          existing.id,
          this.buildUpdateInput(data),
          data.exam ? [examToCreateInput(data.exam)] : [],
        );
        summary.updated += 1;
      }

      if (data.status === PcmsoExamRiskRuleStatusEnum.ACTIVE) {
        summary.active += 1;
      } else {
        summary.draft += 1;
        for (const reason of data.pendingReasons) {
          summary.draftReasons[reason] = (summary.draftReasons[reason] ?? 0) + 1;
        }
      }
    }

    return summary;
  }

  private buildCreateInput(
    data: Nr07RuleData,
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
    data: Nr07RuleData,
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

  private isUpToDate(existing: ExistingRule, data: Nr07RuleData): boolean {
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
      existingExam.isAdmission === data.exam.isAdmission &&
      existingExam.isPeriodic === data.exam.isPeriodic &&
      existingExam.isChange === data.exam.isChange &&
      existingExam.isReturn === data.exam.isReturn &&
      existingExam.isDismissal === data.exam.isDismissal &&
      existingExam.isMale === data.exam.isMale &&
      existingExam.isFemale === data.exam.isFemale &&
      existingExam.validityInMonths === data.exam.validityInMonths &&
      existingExam.considerBetweenDays === data.exam.considerBetweenDays &&
      existingExam.fromAge === data.exam.fromAge &&
      existingExam.toAge === data.exam.toAge &&
      existingExam.minRiskDegree === data.exam.minRiskDegree &&
      existingExam.minRiskDegreeQuantity === data.exam.minRiskDegreeQuantity &&
      existingExam.collectionToleranceDays ===
        data.exam.collectionToleranceDays &&
      existingExam.collectionMoment === data.exam.collectionMoment
    );
  }
}
