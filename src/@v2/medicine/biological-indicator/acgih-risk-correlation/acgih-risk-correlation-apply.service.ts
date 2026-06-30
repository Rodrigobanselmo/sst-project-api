import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import {
  AcgihRiskCorrelationItem,
  AcgihRiskCorrelationService,
} from './acgih-risk-correlation.service';
import {
  AcgihRiskCorrelationSkipReason,
  buildApplyNotes,
  evaluateApplyEligibility,
  mapMatchConfidence,
  mapMatchMethod,
  resolveIsPrimary,
} from './acgih-risk-correlation-apply.util';
import { ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS } from './acgih-risk-correlation-apply.dto';

export type AcgihRiskLinkResultStatus = 'created' | 'alreadyLinked' | 'failed';

export type AcgihRiskLinkResult = {
  riskFactorId: string;
  riskName: string;
  status: AcgihRiskLinkResultStatus;
  linkId?: string;
  isPrimary: boolean;
  error?: string;
};

export type AcgihRiskCorrelationApplyItemStatus =
  | 'created'
  | 'alreadyLinked'
  | 'skipped'
  | 'failed';

export type AcgihRiskCorrelationApplyItemResult = {
  acgihBeiIndicatorId: string;
  substanceName: string;
  officialIndicatorId: string | null;
  finalStatus: AcgihRiskCorrelationItem['finalStatus'];
  cardinality: AcgihRiskCorrelationItem['cardinality'];
  status: AcgihRiskCorrelationApplyItemStatus;
  skipReason?: AcgihRiskCorrelationSkipReason;
  links: AcgihRiskLinkResult[];
  error?: string;
};

export type AcgihRiskCorrelationApplyResponse = {
  dryRun: boolean;
  totals: {
    requestedItems: number;
    eligibleItems: number;
    createdLinks: number;
    alreadyLinked: number;
    skipped: number;
    failed: number;
  };
  items: AcgihRiskCorrelationApplyItemResult[];
};

/**
 * Frente A.3 — apply seguro (MASTER-only) da correlação ACGIH/BEI × Fatores de
 * Risco. ÚNICA escrita do fluxo: BiologicalIndicatorToRisk.
 *
 * Garantias:
 * - servidor autoritativo: reexecuta o preview A.1 e ignora correlação do Client;
 * - aplica somente itens promovidos, sem bloqueios, com status elegível e links;
 * - idempotente por (indicatorId, riskFactorId): pré-checa existentes e trata
 *   P2002 (corrida) como alreadyLinked;
 * - transação por item (TDI = 2 vínculos na mesma transação, tudo-ou-nada);
 * - falha de um item NÃO aborta o lote;
 * - dryRun=true não grava nada e devolve o mesmo formato simulado.
 * Não cria/altera RiskFactor, NR-7, ACGIH staging, BiologicalIndicatorToExam,
 * regra da Biblioteca, nem promove indicadores.
 */
@Injectable()
export class AcgihRiskCorrelationApplyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly previewService: AcgihRiskCorrelationService,
  ) {}

  async apply(params: {
    acgihBeiIndicatorIds?: string[];
    dryRun?: boolean;
    userId: number;
  }): Promise<AcgihRiskCorrelationApplyResponse> {
    const dryRun = params.dryRun ?? false;

    // Servidor autoritativo: reexecuta o preview completo (sem paginação).
    const { items } = await this.previewService.preview();
    const itemById = new Map<string, AcgihRiskCorrelationItem>(
      items.map((i) => [i.acgihBeiIndicatorId, i]),
    );

    // Seleção-alvo: lista explícita OU todos os itens elegíveis do preview.
    const requestedIds =
      params.acgihBeiIndicatorIds && params.acgihBeiIndicatorIds.length
        ? Array.from(new Set(params.acgihBeiIndicatorIds))
        : items
            .filter((i) => evaluateApplyEligibility(i).eligible)
            .map((i) => i.acgihBeiIndicatorId);

    // Teto também quando a lista é omitida (ids vêm do preview). O DTO já limita
    // o array enviado pelo Client; aqui cobrimos o caminho "todos os elegíveis".
    // Lançado ANTES de qualquer create/transaction: nenhuma escrita ocorre.
    if (requestedIds.length > ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS) {
      throw new BadRequestException(
        `Máximo de ${ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS} itens por requisição. Solicitados: ${requestedIds.length}.`,
      );
    }

    const results: AcgihRiskCorrelationApplyItemResult[] = [];

    for (const id of requestedIds) {
      const item = itemById.get(id);

      // Id solicitado não está no preview (não confirmado / inexistente).
      if (!item) {
        results.push({
          acgihBeiIndicatorId: id,
          substanceName: '(desconhecido)',
          officialIndicatorId: null,
          finalStatus: 'NO_MATCH',
          cardinality: 'NONE',
          status: 'skipped',
          skipReason: 'NOT_ELIGIBLE_STATUS',
          links: [],
        });
        continue;
      }

      const eligibility = evaluateApplyEligibility(item);
      if (!eligibility.eligible) {
        results.push(
          this.buildSkipped(
            item,
            eligibility.skipReason ?? 'NOT_ELIGIBLE_STATUS',
          ),
        );
        continue;
      }

      results.push(await this.applyOne(item, params.userId, dryRun));
    }

    const eligibleItems = requestedIds.filter((id) => {
      const item = itemById.get(id);
      return item ? evaluateApplyEligibility(item).eligible : false;
    }).length;

    const createdLinks = results.reduce(
      (acc, r) => acc + r.links.filter((l) => l.status === 'created').length,
      0,
    );
    const alreadyLinked = results.reduce(
      (acc, r) =>
        acc + r.links.filter((l) => l.status === 'alreadyLinked').length,
      0,
    );

    return {
      dryRun,
      totals: {
        requestedItems: requestedIds.length,
        eligibleItems,
        createdLinks,
        alreadyLinked,
        skipped: results.filter((r) => r.status === 'skipped').length,
        failed: results.filter((r) => r.status === 'failed').length,
      },
      items: results,
    };
  }

  private buildSkipped(
    item: AcgihRiskCorrelationItem,
    skipReason: AcgihRiskCorrelationSkipReason,
  ): AcgihRiskCorrelationApplyItemResult {
    return {
      acgihBeiIndicatorId: item.acgihBeiIndicatorId,
      substanceName: item.substanceName,
      officialIndicatorId: item.officialIndicatorId,
      finalStatus: item.finalStatus,
      cardinality: item.cardinality,
      status: 'skipped',
      skipReason,
      links: [],
    };
  }

  /**
   * Aplica um item elegível. Pré-checa vínculos existentes (sem filtrar
   * deleted_at, pois a unicidade ignora soft-delete) e cria apenas os que faltam
   * dentro de UMA transação (tudo-ou-nada por item). P2002 em corrida vira
   * alreadyLinked; qualquer outro erro marca o item como failed sem abortar o lote.
   */
  private async applyOne(
    item: AcgihRiskCorrelationItem,
    userId: number,
    dryRun: boolean,
  ): Promise<AcgihRiskCorrelationApplyItemResult> {
    const officialIndicatorId = item.officialIndicatorId as string;
    const now = new Date();

    const existingRiskFactorIds = new Set(
      (
        await this.prisma.biologicalIndicatorToRisk.findMany({
          where: {
            indicatorId: officialIndicatorId,
            riskFactorId: { in: item.links.map((l) => l.riskFactorId) },
          },
          select: { riskFactorId: true },
        })
      ).map((r) => r.riskFactorId),
    );

    const toCreate = item.links.filter(
      (l) => !existingRiskFactorIds.has(l.riskFactorId),
    );

    const linkResults: AcgihRiskLinkResult[] = item.links
      .filter((l) => existingRiskFactorIds.has(l.riskFactorId))
      .map((l) => ({
        riskFactorId: l.riskFactorId,
        riskName: l.riskName,
        status: 'alreadyLinked' as const,
        isPrimary: resolveIsPrimary(item.cardinality),
      }));

    // dryRun: simula a criação dos que faltam, sem nenhuma escrita.
    if (dryRun) {
      for (const link of toCreate) {
        linkResults.push({
          riskFactorId: link.riskFactorId,
          riskName: link.riskName,
          status: 'created',
          isPrimary: resolveIsPrimary(item.cardinality),
        });
      }
      return this.finalizeItem(item, linkResults);
    }

    if (toCreate.length === 0) {
      return this.finalizeItem(item, linkResults);
    }

    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const out: { riskFactorId: string; id: string }[] = [];
        for (const link of toCreate) {
          const row = await tx.biologicalIndicatorToRisk.create({
            data: {
              indicatorId: officialIndicatorId,
              riskFactorId: link.riskFactorId,
              riskNameSnapshot: link.riskName,
              riskCasSnapshot: link.riskCasRaw,
              matchConfidence: mapMatchConfidence(item.finalStatus),
              matchMethod: mapMatchMethod(item.finalStatus, link),
              isPrimary: resolveIsPrimary(item.cardinality),
              isConfirmed: true,
              requiresReview: false,
              confirmedById: userId,
              confirmedAt: now,
              notes: buildApplyNotes({
                finalStatus: item.finalStatus,
                decisionSource: item.decisionSource,
                cardinality: item.cardinality,
                isGroup: link.isGroup,
                userId,
                date: now,
              }),
            },
            select: { id: true },
          });
          out.push({ riskFactorId: link.riskFactorId, id: row.id });
        }
        return out;
      });

      const idByRisk = new Map(created.map((c) => [c.riskFactorId, c.id]));
      for (const link of toCreate) {
        linkResults.push({
          riskFactorId: link.riskFactorId,
          riskName: link.riskName,
          status: 'created',
          linkId: idByRisk.get(link.riskFactorId),
          isPrimary: resolveIsPrimary(item.cardinality),
        });
      }
      return this.finalizeItem(item, linkResults);
    } catch (error) {
      // Corrida concorrente: unicidade (indicatorId, riskFactorId) violada.
      // Transação inteira revertida; reporta os que faltavam como alreadyLinked.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        for (const link of toCreate) {
          linkResults.push({
            riskFactorId: link.riskFactorId,
            riskName: link.riskName,
            status: 'alreadyLinked',
            isPrimary: resolveIsPrimary(item.cardinality),
          });
        }
        return this.finalizeItem(item, linkResults);
      }

      // Falha real isolada no item: não aborta o lote.
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido no apply.';
      for (const link of toCreate) {
        linkResults.push({
          riskFactorId: link.riskFactorId,
          riskName: link.riskName,
          status: 'failed',
          isPrimary: resolveIsPrimary(item.cardinality),
          error: message,
        });
      }
      return {
        acgihBeiIndicatorId: item.acgihBeiIndicatorId,
        substanceName: item.substanceName,
        officialIndicatorId: item.officialIndicatorId,
        finalStatus: item.finalStatus,
        cardinality: item.cardinality,
        status: 'failed',
        links: linkResults,
        error: message,
      };
    }
  }

  private finalizeItem(
    item: AcgihRiskCorrelationItem,
    links: AcgihRiskLinkResult[],
  ): AcgihRiskCorrelationApplyItemResult {
    const created = links.filter((l) => l.status === 'created').length;
    const status: AcgihRiskCorrelationApplyItemStatus =
      created > 0 ? 'created' : 'alreadyLinked';
    return {
      acgihBeiIndicatorId: item.acgihBeiIndicatorId,
      substanceName: item.substanceName,
      officialIndicatorId: item.officialIndicatorId,
      finalStatus: item.finalStatus,
      cardinality: item.cardinality,
      status,
      links,
    };
  }
}
