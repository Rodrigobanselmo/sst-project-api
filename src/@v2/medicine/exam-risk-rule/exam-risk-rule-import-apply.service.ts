import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  ExamRiskRuleImportPreviewService,
  ExamRiskRuleImportTotals,
} from './exam-risk-rule-import-preview.service';
import { ExamRiskRuleRepository } from './exam-risk-rule.repository';

export type ExamRiskRuleImportApplyResult = {
  fileName: string;
  applied: {
    rulesUpdated: number;
    examsCreated: number;
    examsUpdated: number;
    unchanged: number;
    rejected: number;
    conflict: number;
    invalid: number;
  };
  totals: ExamRiskRuleImportTotals;
  affectedRuleIds: string[];
};

@Injectable()
export class ExamRiskRuleImportApplyService {
  constructor(
    private readonly repository: ExamRiskRuleRepository,
    private readonly previewService: ExamRiskRuleImportPreviewService,
  ) {}

  async apply(params: {
    buffer: Buffer;
    fileName: string;
    userId?: number;
  }): Promise<ExamRiskRuleImportApplyResult> {
    // Reconsulta o banco AGORA: reclassifica com o estado atual (idempotência).
    const model = await this.previewService.buildModel({
      buffer: params.buffer,
      fileName: params.fileName,
    });

    const ruleUpdates: {
      id: string;
      data: Prisma.PcmsoExamRiskRuleUpdateInput;
    }[] = [];
    const examCreates: {
      ruleId: string;
      data: Prisma.PcmsoExamRiskRuleExamCreateWithoutRuleInput;
    }[] = [];
    const examUpdates: {
      id: string;
      data: Prisma.PcmsoExamRiskRuleExamUpdateInput;
    }[] = [];
    const affectedRuleIds: string[] = [];

    for (const rulePlan of model.plan) {
      let touched = false;
      if (rulePlan.ruleUpdateData) {
        ruleUpdates.push({
          id: rulePlan.ruleId,
          data: rulePlan.ruleUpdateData as Prisma.PcmsoExamRiskRuleUpdateInput,
        });
        touched = true;
      }
      for (const create of rulePlan.examCreates) {
        examCreates.push({
          ruleId: rulePlan.ruleId,
          data: create.data as unknown as Prisma.PcmsoExamRiskRuleExamCreateWithoutRuleInput,
        });
        touched = true;
      }
      for (const update of rulePlan.examUpdates) {
        examUpdates.push({
          id: update.id,
          data: update.data as unknown as Prisma.PcmsoExamRiskRuleExamUpdateInput,
        });
        touched = true;
      }
      if (touched) affectedRuleIds.push(rulePlan.ruleId);
    }

    if (ruleUpdates.length || examCreates.length || examUpdates.length) {
      await this.repository.applyImportBatch({
        ruleUpdates,
        examCreates,
        examUpdates,
      });
    }

    return {
      fileName: model.fileName,
      applied: {
        rulesUpdated: ruleUpdates.length,
        examsCreated: examCreates.length,
        examsUpdated: examUpdates.length,
        unchanged: model.totals.unchanged,
        rejected: model.totals.rejected,
        conflict: model.totals.conflict,
        invalid: model.totals.invalid,
      },
      totals: model.totals,
      affectedRuleIds,
    };
  }
}
