import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PcmsoAcgihBeiComparisonDecisionEnum, Prisma } from '@prisma/client';

import { AcgihBeiComparisonService } from './acgih-bei-comparison.service';
import { ComparisonReviewRepository } from './comparison-review.repository';

export type UpsertReviewOutcome = 'CREATED' | 'UPDATED' | 'RESTORED';

const isUniqueViolation = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

/**
 * Camada de curadoria (4O.1): registra/atualiza/limpa a DECISÃO técnica de uma
 * linha da comparação. É puramente aditiva — NÃO altera o cálculo da comparação,
 * NR-7, ACGIH/BEI, Biblioteca, fonte complementar, regras nem roda sync.
 *
 * O servidor é a fonte da verdade: recalcula a comparação para localizar a linha
 * e gravar os snapshots de contexto (status/ação/IDs), nunca confiando no Client.
 */
@Injectable()
export class ComparisonReviewService {
  constructor(
    private readonly repository: ComparisonReviewRepository,
    private readonly comparisonService: AcgihBeiComparisonService,
  ) {}

  async upsert(params: {
    acgihBeiIndicatorId: string;
    decision: PcmsoAcgihBeiComparisonDecisionEnum;
    technicalNote: string;
    userId?: number;
  }) {
    const acgihBeiIndicatorId = params.acgihBeiIndicatorId?.trim();
    if (!acgihBeiIndicatorId) {
      throw new BadRequestException('acgihBeiIndicatorId é obrigatório.');
    }
    const technicalNote = params.technicalNote?.trim();
    if (!technicalNote) {
      throw new BadRequestException('A nota técnica é obrigatória.');
    }

    // 1. Recalcula a comparação e localiza a linha (server-authoritative).
    const rows = await this.comparisonService.computeAll();
    const row = rows.find((r) => r.acgihBeiId === acgihBeiIndicatorId);
    if (!row) {
      throw new NotFoundException(
        'Indicador ACGIH/BEI não encontrado ou indisponível para comparação.',
      );
    }

    const nr7IndicatorId = row.nr7IndicatorId;
    const examRiskRuleId = row.examRiskRuleId;
    const scalarSnapshot = {
      comparisonStatusSnapshot: String(row.comparisonStatus),
      suggestedActionSnapshot: String(row.suggestedAction),
      decision: params.decision,
      technicalNote,
    };

    const buildUpdateData = (
      reviewedById: number | null,
    ): Prisma.PcmsoAcgihBeiComparisonReviewUpdateInput => ({
      ...scalarSnapshot,
      nr7Indicator: nr7IndicatorId
        ? { connect: { id: nr7IndicatorId } }
        : { disconnect: true },
      examRiskRule: examRiskRuleId
        ? { connect: { id: examRiskRuleId } }
        : { disconnect: true },
      deleted_at: null,
      deletedById: null,
      updatedById: params.userId ?? null,
      reviewedById: params.userId ?? reviewedById ?? null,
    });

    // 2. Upsert idempotente por acgihBeiIndicatorId (chave única estável).
    const existing = await this.repository.findRawByAcgihId(acgihBeiIndicatorId);

    if (existing) {
      const wasDeleted = Boolean(existing.deleted_at);
      const updated = await this.repository.update(
        existing.id,
        buildUpdateData(existing.reviewedById),
      );
      return this.result(wasDeleted ? 'RESTORED' : 'UPDATED', updated);
    }

    try {
      const created = await this.repository.create({
        acgihBeiIndicator: { connect: { id: acgihBeiIndicatorId } },
        nr7Indicator: nr7IndicatorId
          ? { connect: { id: nr7IndicatorId } }
          : undefined,
        examRiskRule: examRiskRuleId
          ? { connect: { id: examRiskRuleId } }
          : undefined,
        ...scalarSnapshot,
        reviewedById: params.userId ?? null,
      });
      return this.result('CREATED', created);
    } catch (error) {
      // Corrida/duplo clique: a constraint única garante não duplicar.
      if (isUniqueViolation(error)) {
        const after =
          await this.repository.findRawByAcgihId(acgihBeiIndicatorId);
        if (after) {
          const updated = await this.repository.update(
            after.id,
            buildUpdateData(after.reviewedById),
          );
          return this.result('UPDATED', updated);
        }
      }
      throw error;
    }
  }

  /** Limpa/reabre a decisão (soft-delete). Idempotente. */
  async remove(params: { acgihBeiIndicatorId: string; userId?: number }) {
    const acgihBeiIndicatorId = params.acgihBeiIndicatorId?.trim();
    if (!acgihBeiIndicatorId) {
      throw new BadRequestException('acgihBeiIndicatorId é obrigatório.');
    }
    const existing = await this.repository.findRawByAcgihId(acgihBeiIndicatorId);
    if (!existing || existing.deleted_at) {
      return { acgihBeiIndicatorId, removed: true };
    }
    await this.repository.update(existing.id, {
      deleted_at: new Date(),
      deletedById: params.userId ?? null,
    });
    return { acgihBeiIndicatorId, removed: true };
  }

  private result(
    outcome: UpsertReviewOutcome,
    review: Awaited<ReturnType<ComparisonReviewRepository['create']>>,
  ) {
    return { outcome, review };
  }
}
