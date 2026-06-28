import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PcmsoExamRiskRuleReferenceSourceEnum,
  PcmsoExamRiskRuleReferenceStatusEnum,
  Prisma,
} from '@prisma/client';

import { AcgihBeiComparisonService } from '../acgih-bei-comparison/acgih-bei-comparison.service';
import { isReferenceEligible, getReferenceEligibilityBlockers } from '../acgih-bei-comparison/acgih-bei-comparison.util';
import { ExamRiskRuleReferenceRepository } from './exam-risk-rule-reference.repository';

export type ApplyReferenceOutcome = 'CREATED' | 'RESTORED' | 'UNCHANGED';

const isUniqueViolation = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

@Injectable()
export class ExamRiskRuleReferenceService {
  constructor(
    private readonly repository: ExamRiskRuleReferenceRepository,
    private readonly comparisonService: AcgihBeiComparisonService,
  ) {}

  /** Lista as fontes complementares (não deletadas) de uma regra existente. */
  async listByRule(ruleId: string) {
    const rule = await this.repository.findRuleById(ruleId);
    if (!rule) {
      throw new NotFoundException('Regra Exame × Risco não encontrada.');
    }
    return this.repository.listByRule(ruleId);
  }

  /**
   * Adiciona a ACGIH/BEI como fonte complementar de uma regra EXISTENTE, a
   * partir da comparação. O servidor recalcula a elegibilidade e resolve a
   * regra de destino — nunca confia em ruleId vindo do Client. Idempotente.
   */
  async applyAcgihReference(params: {
    acgihBeiIndicatorId: string;
    userId?: number;
  }) {
    const acgihBeiIndicatorId = params.acgihBeiIndicatorId?.trim();
    if (!acgihBeiIndicatorId) {
      throw new BadRequestException('acgihBeiIndicatorId é obrigatório.');
    }

    // 1. Recalcula a comparação e localiza a linha do indicador informado.
    const rows = await this.comparisonService.computeAll();
    const row = rows.find((r) => r.acgihBeiId === acgihBeiIndicatorId);
    if (!row) {
      throw new NotFoundException(
        'Indicador ACGIH/BEI não encontrado ou indisponível para comparação.',
      );
    }

    // 2. Bloqueio de elegibilidade (impede aplicação indevida). Aceita o caminho
    // atual (item já coberto) OU o caminho de equivalência técnica (4O.3):
    // decisão FALSE_DIVERGENCE_EQUIVALENT com readiness seguro das três bases.
    // O servidor é autoritativo: recalcula a comparação e revalida o estado.
    if (!row.examRiskRuleId) {
      throw new BadRequestException(
        'Não há regra existente resolvida para este item. Nenhuma regra será criada nesta fase.',
      );
    }
    if (!isReferenceEligible(row)) {
      const blockers = getReferenceEligibilityBlockers(row);
      throw new BadRequestException(
        blockers.length
          ? `Item não elegível para fonte complementar: ${blockers.join(' ')}`
          : 'Item não elegível para fonte complementar.',
      );
    }

    // 3. Revalida regra e indicador no estado atual do banco.
    const rule = await this.repository.findRuleById(row.examRiskRuleId);
    if (!rule) {
      throw new NotFoundException(
        'Regra de destino não encontrada ou removida.',
      );
    }
    const indicator =
      await this.repository.findAcgihIndicatorById(acgihBeiIndicatorId);
    if (!indicator) {
      throw new NotFoundException('Indicador ACGIH/BEI não encontrado.');
    }

    const referenceLabel = this.buildLabel(indicator);
    const referenceYear = indicator.referenceYear ?? indicator.sourceYear ?? null;

    // 4. Upsert idempotente por (ruleId, acgihBeiIndicatorId).
    const existing = await this.repository.findRawByRuleAndAcgih(
      rule.id,
      acgihBeiIndicatorId,
    );

    if (existing) {
      const isActive =
        !existing.deleted_at &&
        existing.status === PcmsoExamRiskRuleReferenceStatusEnum.ACTIVE;
      if (isActive) {
        return this.result('UNCHANGED', existing);
      }
      const restored = await this.repository.update(existing.id, {
        status: PcmsoExamRiskRuleReferenceStatusEnum.ACTIVE,
        deleted_at: null,
        deletedById: null,
        updatedById: params.userId ?? null,
        referenceLabel,
        referenceYear,
      });
      return this.result('RESTORED', restored);
    }

    try {
      const created = await this.repository.create({
        rule: { connect: { id: rule.id } },
        sourceType: PcmsoExamRiskRuleReferenceSourceEnum.ACGIH_BEI,
        acgihBeiIndicator: { connect: { id: acgihBeiIndicatorId } },
        referenceLabel,
        referenceYear,
        status: PcmsoExamRiskRuleReferenceStatusEnum.ACTIVE,
        createdById: params.userId ?? null,
      });
      return this.result('CREATED', created);
    } catch (error) {
      // Corrida/duplo clique: a constraint única garante não duplicar.
      if (isUniqueViolation(error)) {
        const after = await this.repository.findRawByRuleAndAcgih(
          rule.id,
          acgihBeiIndicatorId,
        );
        if (after) return this.result('UNCHANGED', after);
      }
      throw error;
    }
  }

  /** Remove (soft delete + inativa) uma fonte complementar da regra. */
  async remove(params: {
    ruleId: string;
    referenceId: string;
    userId?: number;
  }) {
    const rule = await this.repository.findRuleById(params.ruleId);
    if (!rule) {
      throw new NotFoundException('Regra Exame × Risco não encontrada.');
    }
    const reference = await this.repository.findById(params.referenceId);
    if (!reference || reference.ruleId !== params.ruleId) {
      throw new NotFoundException('Fonte complementar não encontrada.');
    }
    if (reference.deleted_at) {
      return { id: reference.id, removed: true };
    }
    await this.repository.update(reference.id, {
      status: PcmsoExamRiskRuleReferenceStatusEnum.INACTIVE,
      deleted_at: new Date(),
      deletedById: params.userId ?? null,
    });
    return { id: reference.id, removed: true };
  }

  private buildLabel(indicator: {
    substanceName: string;
    determinant: string | null;
    biologicalMatrix: string | null;
    referenceYear: number | null;
    sourceYear: number | null;
  }): string {
    const year = indicator.referenceYear ?? indicator.sourceYear ?? null;
    const detail = [indicator.determinant, indicator.biologicalMatrix]
      .filter((value): value is string => !!value?.trim())
      .join(', ');
    const base = `ACGIH/BEI${year ? ` ${year}` : ''} — ${indicator.substanceName}`;
    return detail ? `${base} (${detail})` : base;
  }

  private result(
    outcome: ApplyReferenceOutcome,
    reference: Awaited<
      ReturnType<ExamRiskRuleReferenceRepository['findById']>
    >,
  ) {
    return { outcome, reference };
  }
}
