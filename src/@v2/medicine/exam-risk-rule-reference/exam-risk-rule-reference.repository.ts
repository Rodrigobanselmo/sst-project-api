import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

const referenceSelect = {
  id: true,
  ruleId: true,
  sourceType: true,
  acgihBeiIndicatorId: true,
  nr7IndicatorId: true,
  referenceLabel: true,
  referenceYear: true,
  description: true,
  notes: true,
  status: true,
  createdById: true,
  updatedById: true,
  deletedById: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} satisfies Prisma.PcmsoExamRiskRuleReferenceSelect;

@Injectable()
export class ExamRiskRuleReferenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Regra existente e não deletada (fonte de verdade do destino). */
  findRuleById(ruleId: string) {
    return this.prisma.pcmsoExamRiskRule.findFirst({
      where: { id: ruleId, deleted_at: null },
      select: { id: true, source: true, status: true, deleted_at: true },
    });
  }

  /** Indicador ACGIH/BEI não deletado (para snapshot e validação). */
  findAcgihIndicatorById(id: string) {
    return this.prisma.pcmsoAcgihBeiIndicator.findFirst({
      where: { id, deleted_at: null },
      select: {
        id: true,
        substanceName: true,
        determinant: true,
        biologicalMatrix: true,
        samplingTime: true,
        referenceYear: true,
        sourceYear: true,
      },
    });
  }

  /**
   * Busca a referência ACGIH/BEI da regra INCLUINDO soft-deleted, para
   * idempotência (decidir entre criar, restaurar ou no-op).
   */
  findRawByRuleAndAcgih(ruleId: string, acgihBeiIndicatorId: string) {
    return this.prisma.pcmsoExamRiskRuleReference.findFirst({
      where: { ruleId, acgihBeiIndicatorId },
      select: referenceSelect,
    });
  }

  findById(id: string) {
    return this.prisma.pcmsoExamRiskRuleReference.findUnique({
      where: { id },
      select: referenceSelect,
    });
  }

  /** Fontes complementares não deletadas da regra (ativas e inativas). */
  listByRule(ruleId: string) {
    return this.prisma.pcmsoExamRiskRuleReference.findMany({
      where: { ruleId, deleted_at: null },
      orderBy: { created_at: 'asc' },
      select: referenceSelect,
    });
  }

  create(data: Prisma.PcmsoExamRiskRuleReferenceCreateInput) {
    return this.prisma.pcmsoExamRiskRuleReference.create({
      data,
      select: referenceSelect,
    });
  }

  update(id: string, data: Prisma.PcmsoExamRiskRuleReferenceUpdateInput) {
    return this.prisma.pcmsoExamRiskRuleReference.update({
      where: { id },
      data,
      select: referenceSelect,
    });
  }
}
