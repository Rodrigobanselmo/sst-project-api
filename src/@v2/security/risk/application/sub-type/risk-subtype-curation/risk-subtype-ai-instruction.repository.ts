import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';

import type {
  RiskSubTypeAiInstructionRecord,
  UpsertRiskSubTypeAiInstructionInput,
} from './risk-subtype-ai-instruction.types';

@Injectable()
export class RiskSubTypeAiInstructionRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async findBySubTypeId(subTypeId: number): Promise<RiskSubTypeAiInstructionRecord | null> {
    const row = await this.prisma.riskSubTypeAiInstruction.findUnique({
      where: { subTypeId },
    });

    if (!row) return null;

    return this.toRecord(row);
  }

  async upsert(input: UpsertRiskSubTypeAiInstructionInput): Promise<RiskSubTypeAiInstructionRecord> {
    const existing = await this.prisma.riskSubTypeAiInstruction.findUnique({
      where: { subTypeId: input.subTypeId },
    });

    const row = await this.prisma.riskSubTypeAiInstruction.upsert({
      where: { subTypeId: input.subTypeId },
      create: {
        subTypeId: input.subTypeId,
        useSystemDefault: input.useSystemDefault,
        instructions: input.instructions ?? null,
        positiveExamples: input.positiveExamples ?? null,
        negativeExamples: input.negativeExamples ?? null,
        cautionRules: input.cautionRules ?? null,
        preferredModel: input.preferredModel ?? null,
        revision: 1,
        updatedById: input.updatedById,
      },
      update: {
        useSystemDefault: input.useSystemDefault,
        instructions: input.instructions ?? null,
        positiveExamples: input.positiveExamples ?? null,
        negativeExamples: input.negativeExamples ?? null,
        cautionRules: input.cautionRules ?? null,
        preferredModel: input.preferredModel ?? null,
        revision: (existing?.revision ?? 0) + 1,
        updatedById: input.updatedById,
      },
    });

    return this.toRecord(row);
  }

  private toRecord(row: {
    subTypeId: number;
    useSystemDefault: boolean;
    instructions: string | null;
    positiveExamples: string | null;
    negativeExamples: string | null;
    cautionRules: string | null;
    preferredModel: string | null;
    revision: number;
    updatedById: number | null;
    updated_at: Date;
  }): RiskSubTypeAiInstructionRecord {
    return {
      subTypeId: row.subTypeId,
      useSystemDefault: row.useSystemDefault,
      instructions: row.instructions,
      positiveExamples: row.positiveExamples,
      negativeExamples: row.negativeExamples,
      cautionRules: row.cautionRules,
      preferredModel: row.preferredModel,
      revision: row.revision,
      updatedById: row.updatedById,
      updatedAt: row.updated_at.toISOString(),
    };
  }
}
