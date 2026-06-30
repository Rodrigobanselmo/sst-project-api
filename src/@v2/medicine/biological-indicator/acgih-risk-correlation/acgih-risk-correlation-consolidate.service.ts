import { BadRequestException, Injectable } from '@nestjs/common';

import { AcgihOfficialIndicatorApplyService } from '../acgih-promotion/acgih-official-indicator-apply.service';
import { AcgihOfficialIndicatorPreviewService } from '../acgih-promotion/acgih-official-indicator-preview.service';
import { AcgihRiskCorrelationService } from './acgih-risk-correlation.service';
import { ACGIH_RISK_CORRELATION_EXPECTED_TOTAL } from './acgih-risk-correlation-consolidate.dto';

export type AcgihConsolidateItemStatus =
  | 'created'
  | 'alreadyPromoted'
  | 'skipped'
  | 'failed';

export type AcgihConsolidateItemResult = {
  acgihBeiIndicatorId: string;
  substanceName: string;
  officialIndicatorId: string | null;
  status: AcgihConsolidateItemStatus;
  reason?: string;
};

export type AcgihConsolidateResponse = {
  totalAcgih: number;
  alreadyPromoted: number;
  created: number;
  skipped: number;
  failed: number;
  items: AcgihConsolidateItemResult[];
};

/**
 * Fix — consolidação COMPLETA dos ACGIH/BEI da correlação (os "65") como
 * indicadores oficiais. Diferente da promoção 4P.2 (que só inclui o recorte
 * NO_MATCH_CONFIRMED / REAL_DIVERGENCE), aqui todo item da base ACGIH pode virar
 * indicador oficial, mesmo com reuso/cobertura NR-7 — a proteção contra
 * duplicidade operacional fica para a Biblioteca Risco × Exame.
 *
 * Garantias:
 * - servidor autoritativo: reexecuta o preview de correlação (A.1) e o mapper
 *   de payload da promoção 4P.2; ignora qualquer dado vindo do Client;
 * - ÚNICA escrita: OccupationalBiologicalIndicator (via o mesmo create da 4P.2);
 * - idempotente por acgihBeiIndicatorId/idempotencyKey (P2002 => alreadyPromoted);
 * - falha de um item não aborta o lote;
 * - NÃO cria BiologicalIndicatorToRisk, BiologicalIndicatorToExam, regra da
 *   Biblioteca; não altera RiskFactor, NR-7 nem staging ACGIH.
 */
@Injectable()
export class AcgihRiskCorrelationConsolidateService {
  constructor(
    private readonly correlationService: AcgihRiskCorrelationService,
    private readonly promotionPreviewService: AcgihOfficialIndicatorPreviewService,
    private readonly promotionApplyService: AcgihOfficialIndicatorApplyService,
  ) {}

  async consolidate(params: {
    userId: number;
  }): Promise<AcgihConsolidateResponse> {
    // 1) Reexecuta o preview de correlação (autoritativo). Os "65".
    const { summary, items } = await this.correlationService.preview();

    // 2) Guardas de segurança antes de qualquer escrita.
    if (summary.total !== ACGIH_RISK_CORRELATION_EXPECTED_TOTAL) {
      throw new BadRequestException(
        `Base ACGIH/BEI incompleta/divergente: esperados ${ACGIH_RISK_CORRELATION_EXPECTED_TOTAL} itens, encontrados ${summary.total}. Consolidação abortada.`,
      );
    }
    if (summary.blockersCount > 0) {
      throw new BadRequestException(
        `Existem ${summary.blockersCount} bloqueio(s) na correlação. Resolva antes de consolidar.`,
      );
    }
    const blockingStatuses = new Set([
      'NO_MATCH',
      'AMBIGUOUS',
      'OVERRIDE_TARGET_MISSING',
    ]);
    const withBlockingStatus = items.filter((i) =>
      blockingStatuses.has(i.finalStatus),
    );
    if (withBlockingStatus.length > 0) {
      throw new BadRequestException(
        `Existem ${withBlockingStatus.length} item(ns) com status não consolidável (NO_MATCH/AMBIGUOUS/OVERRIDE_TARGET_MISSING). Consolidação abortada.`,
      );
    }

    // 3) Payloads de TODOS os ACGIH (sem o recorte por tier da promoção 4P.2).
    const payloadById =
      await this.promotionPreviewService.computeProposedPayloadsByAcgihId();

    const results: AcgihConsolidateItemResult[] = [];

    for (const item of items) {
      // Já promovido (tem indicador oficial): idempotência.
      if (item.officialIndicatorId) {
        results.push({
          acgihBeiIndicatorId: item.acgihBeiIndicatorId,
          substanceName: item.substanceName,
          officialIndicatorId: item.officialIndicatorId,
          status: 'alreadyPromoted',
        });
        continue;
      }

      const payload = payloadById.get(item.acgihBeiIndicatorId);
      if (!payload) {
        results.push({
          acgihBeiIndicatorId: item.acgihBeiIndicatorId,
          substanceName: item.substanceName,
          officialIndicatorId: null,
          status: 'skipped',
          reason:
            'Sem payload de promoção correspondente (item ausente da comparação).',
        });
        continue;
      }

      try {
        const created =
          await this.promotionApplyService.createOfficialDraftFromPayload(
            payload,
            params.userId,
          );

        if (created.status === 'created') {
          results.push({
            acgihBeiIndicatorId: item.acgihBeiIndicatorId,
            substanceName: item.substanceName,
            officialIndicatorId:
              created.occupationalBiologicalIndicatorId ?? null,
            status: 'created',
          });
        } else if (created.status === 'skipped') {
          // P2002 / já promovido em corrida.
          results.push({
            acgihBeiIndicatorId: item.acgihBeiIndicatorId,
            substanceName: item.substanceName,
            officialIndicatorId: null,
            status: 'alreadyPromoted',
            reason: created.reason,
          });
        } else {
          // blocked: campos obrigatórios ausentes (ex.: momento não mapeável).
          results.push({
            acgihBeiIndicatorId: item.acgihBeiIndicatorId,
            substanceName: item.substanceName,
            officialIndicatorId: null,
            status: 'failed',
            reason: created.reason,
          });
        }
      } catch (error) {
        // Falha isolada não aborta o lote.
        results.push({
          acgihBeiIndicatorId: item.acgihBeiIndicatorId,
          substanceName: item.substanceName,
          officialIndicatorId: null,
          status: 'failed',
          reason:
            error instanceof Error
              ? error.message
              : 'Erro desconhecido ao criar indicador oficial.',
        });
      }
    }

    return {
      totalAcgih: summary.total,
      alreadyPromoted: results.filter((r) => r.status === 'alreadyPromoted')
        .length,
      created: results.filter((r) => r.status === 'created').length,
      skipped: results.filter((r) => r.status === 'skipped').length,
      failed: results.filter((r) => r.status === 'failed').length,
      items: results,
    };
  }
}
