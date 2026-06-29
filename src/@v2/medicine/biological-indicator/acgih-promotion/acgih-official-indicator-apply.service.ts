import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { ProposedOfficialIndicatorPayload } from './acgih-official-indicator-preview.mapper';
import { AcgihOfficialIndicatorPreviewService } from './acgih-official-indicator-preview.service';
import {
  AcgihPromotionDuplicateRisk,
  AcgihPromotionEligibilityStatus,
  AcgihPromotionPreviewItem,
} from './acgih-official-indicator-preview.util';
import { ACGIH_PROMOTION_APPLY_MAX_ITEMS } from './acgih-official-indicator-apply.dto';

export type AcgihPromotionApplyItemStatus = 'created' | 'skipped' | 'blocked';

export type AcgihPromotionApplyItemResult = {
  acgihBeiIndicatorId: string;
  status: AcgihPromotionApplyItemStatus;
  occupationalBiologicalIndicatorId?: string;
  reason: string;
  blockers?: string[];
  warnings?: string[];
};

export type AcgihPromotionApplyResponse = {
  totals: {
    requested: number;
    eligible: number;
    created: number;
    skipped: number;
    blocked: number;
  };
  items: AcgihPromotionApplyItemResult[];
};

/** Campos obrigatórios (NOT NULL no banco) reassertados antes do INSERT. */
const REQUIRED_PAYLOAD_FIELDS: Array<keyof ProposedOfficialIndicatorPayload> = [
  'substanceName',
  'substanceNameNormalized',
  'biologicalIndicatorOriginal',
  'biologicalIndicatorNormalized',
  'biologicalMatrix',
  'collectionMoment',
  'occupationalApplicability',
  'idempotencyKey',
];

/**
 * 4P.2A — promoção REAL de candidatos ACGIH/BEI a OccupationalBiologicalIndicator
 * DRAFT. Reutiliza o serviço de preview (autoritativo) para elegibilidade.
 *
 * Garantias:
 * - cria apenas itens ELIGIBLE limpos (WARNING e BLOCKED não promovem nesta versão);
 * - idempotente por acgihBeiIndicatorId / idempotencyKey (já promovido => skipped);
 * - não cria regra Biblioteca, não vincula risco/exame, não ativa indicador,
 *   não altera NR-7/ACGIH origem/comparação/fonte complementar/sync.
 */
@Injectable()
export class AcgihOfficialIndicatorApplyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly previewService: AcgihOfficialIndicatorPreviewService,
  ) {}

  async apply(params: {
    acgihBeiIndicatorIds?: string[];
    includeDivergenceDerived?: boolean;
    userId: number;
  }): Promise<AcgihPromotionApplyResponse> {
    const includeDivergenceDerived = params.includeDivergenceDerived ?? false;

    // Servidor autoritativo: reexecuta o preview completo (sem paginação).
    const items = await this.previewService.computeEvaluatedItems({
      includeDivergenceDerived,
    });
    const itemById = new Map<string, AcgihPromotionPreviewItem>(
      items.map((i) => [i.acgihBeiIndicatorId, i]),
    );

    // Resolve a seleção-alvo: lista explícita OU todos os ELIGIBLE do preview.
    const requestedIds =
      params.acgihBeiIndicatorIds && params.acgihBeiIndicatorIds.length
        ? Array.from(new Set(params.acgihBeiIndicatorIds))
        : items
            .filter(
              (i) =>
                i.eligibilityStatus ===
                AcgihPromotionEligibilityStatus.ELIGIBLE,
            )
            .map((i) => i.acgihBeiIndicatorId);

    if (requestedIds.length > ACGIH_PROMOTION_APPLY_MAX_ITEMS) {
      throw new BadRequestException(
        `Máximo de ${ACGIH_PROMOTION_APPLY_MAX_ITEMS} itens por requisição. Solicitados: ${requestedIds.length}.`,
      );
    }

    const eligibleCount = requestedIds.filter(
      (id) =>
        itemById.get(id)?.eligibilityStatus ===
        AcgihPromotionEligibilityStatus.ELIGIBLE,
    ).length;

    const results: AcgihPromotionApplyItemResult[] = [];

    for (const id of requestedIds) {
      const item = itemById.get(id);

      // Não é candidato do preview (não confirmado / stale / tier não incluído).
      if (!item) {
        results.push({
          acgihBeiIndicatorId: id,
          status: 'blocked',
          reason:
            'Item não está entre os candidatos elegíveis do preview (revise a decisão técnica ou o opt-in de divergência).',
        });
        continue;
      }

      // Já promovido => idempotência: skipped (não bloqueia).
      if (item.duplicateRisk === AcgihPromotionDuplicateRisk.ALREADY_PROMOTED) {
        results.push({
          acgihBeiIndicatorId: id,
          status: 'skipped',
          reason: 'Já promovido anteriormente para indicador oficial.',
        });
        continue;
      }

      // WARNING não promove nesta versão (MVP). BLOCKED nunca promove.
      if (
        item.eligibilityStatus === AcgihPromotionEligibilityStatus.WARNING ||
        item.eligibilityStatus === AcgihPromotionEligibilityStatus.BLOCKED
      ) {
        results.push({
          acgihBeiIndicatorId: id,
          status: 'blocked',
          reason:
            item.eligibilityStatus === AcgihPromotionEligibilityStatus.WARNING
              ? 'Item com aviso não é promovido nesta versão (4P.2A). Revisar manualmente.'
              : 'Item bloqueado pela elegibilidade.',
          blockers: item.blockers,
          warnings: item.warnings,
        });
        continue;
      }

      // ELIGIBLE: defesa final de campos obrigatórios não-nulos.
      const missing = this.findMissingRequiredFields(
        item.proposedOfficialPayload,
      );
      if (missing.length) {
        results.push({
          acgihBeiIndicatorId: id,
          status: 'blocked',
          reason: `Campos obrigatórios ausentes: ${missing.join(', ')}.`,
          blockers: missing.map((f) => `MISSING_${f}`),
        });
        continue;
      }

      results.push(
        await this.promoteOne(item.proposedOfficialPayload, params.userId),
      );
    }

    return {
      totals: {
        requested: requestedIds.length,
        eligible: eligibleCount,
        created: results.filter((r) => r.status === 'created').length,
        skipped: results.filter((r) => r.status === 'skipped').length,
        blocked: results.filter((r) => r.status === 'blocked').length,
      },
      items: results,
    };
  }

  /**
   * Cria um indicador oficial DRAFT em transação isolada por item. Isolar por
   * item é proposital: no Postgres, uma violação de unicidade (P2002) aborta a
   * transação corrente; isolando, uma corrida em um item não invalida os demais
   * e o P2002 é convertido em `skipped` (idempotência).
   */
  private async promoteOne(
    payload: ProposedOfficialIndicatorPayload,
    userId: number,
  ): Promise<AcgihPromotionApplyItemResult> {
    const reviewNotes = this.buildAuditNote(userId);
    try {
      const created = await this.prisma.$transaction(async (tx) => {
        return tx.occupationalBiologicalIndicator.create({
          data: {
            normativeSource: payload.normativeSource,
            dataOrigin: payload.dataOrigin,
            status: payload.status,
            acgihBeiIndicatorId: payload.acgihBeiIndicatorId,
            idempotencyKey: payload.idempotencyKey,
            sourcePage: payload.sourcePage,
            requiresNormativeReview: payload.requiresNormativeReview,
            // NR-7-only: nulos para ACGIH/BEI (guard NR-7 não se aplica aqui).
            annex: null,
            tableNumber: null,
            indicatorType: null,
            normativeVersion: payload.normativeVersion,
            substanceName: payload.substanceName,
            substanceNameNormalized: payload.substanceNameNormalized,
            casPrimary: payload.casPrimary,
            casNumbers: payload.casNumbers,
            biologicalIndicatorOriginal: payload.biologicalIndicatorOriginal,
            biologicalIndicatorNormalized: payload.biologicalIndicatorNormalized,
            biologicalMatrix: payload.biologicalMatrix as string,
            collectionMoment: payload.collectionMoment!,
            referenceValue: payload.referenceValue,
            referenceValueRaw: payload.referenceValueRaw,
            unit: payload.unit,
            occupationalApplicability:
              payload.occupationalApplicability as unknown as Prisma.InputJsonValue,
            // Auditoria textual; revisão normativa/manual ainda pendente.
            reviewNotes,
            reviewedById: null,
            reviewedAt: null,
          },
          select: { id: true },
        });
      });

      return {
        acgihBeiIndicatorId: payload.acgihBeiIndicatorId,
        status: 'created',
        occupationalBiologicalIndicatorId: created.id,
        reason: 'Indicador oficial criado como DRAFT (revisão normativa pendente).',
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // Corrida: já promovido por acgihBeiIndicatorId/idempotencyKey.
        return {
          acgihBeiIndicatorId: payload.acgihBeiIndicatorId,
          status: 'skipped',
          reason:
            'Já promovido (violação de unicidade detectada na gravação concorrente).',
        };
      }
      throw error;
    }
  }

  private findMissingRequiredFields(
    payload: ProposedOfficialIndicatorPayload,
  ): string[] {
    const missing: string[] = [];
    for (const field of REQUIRED_PAYLOAD_FIELDS) {
      const value = payload[field];
      const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '');
      if (isEmpty) missing.push(field);
    }
    return missing;
  }

  private buildAuditNote(userId: number): string {
    const date = new Date().toLocaleString('pt-BR');
    return `Promovido da comparação ACGIH/BEI por ${userId} em ${date}. Indicador criado como DRAFT para revisão normativa/manual antes de uso operacional.`;
  }
}
