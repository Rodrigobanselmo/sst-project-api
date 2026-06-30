import { Injectable } from '@nestjs/common';
import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  Prisma,
} from '@prisma/client';

import {
  AcgihExamLinkRepository,
  AcgihOfficialIndicatorRow,
} from './acgih-exam-link.repository';
import {
  AcgihExamCandidate,
  AcgihExamCatalogEntry,
  AcgihExamPreviewResult,
  buildAcgihExamName,
  classifyAcgihExamPreview,
  matchAcgihIndicatorExam,
} from './acgih-exam-link.util';
import {
  materialsAreCompatible,
  scoreNameCompatibility,
} from '../biological-indicator-exam-provision.util';
import { normalizeText } from '../biological-indicator-normalize.util';

export type AcgihExamLinkAction =
  | 'linkCreated'
  | 'alreadyLinked'
  | 'blocked'
  | 'failed';

export type AcgihExamLinkReason =
  | 'NO_EXAM_MATCH'
  | 'AMBIGUOUS_EXAM_MATCH'
  | 'NO_OFFICIAL_INDICATOR'
  | 'MISSING_DETERMINANT'
  | 'P2002_ALREADY_LINKED';

export type AcgihExamLinkItemResult = {
  indicatorId: string;
  substanceName: string;
  determinant: string;
  matrix: string;
  examId?: number;
  examName?: string;
  action: AcgihExamLinkAction;
  reason?: AcgihExamLinkReason;
  candidates?: AcgihExamCandidate[];
};

export type AcgihExamLinkTotals = {
  indicators: number;
  eligible: number;
  linksCreated: number;
  alreadyLinked: number;
  blocked: number;
  failed: number;
};

export type AcgihExamLinkResponse = {
  dryRun: boolean;
  totals: AcgihExamLinkTotals;
  items: AcgihExamLinkItemResult[];
};

// ── Preview (read-only) — alimenta as colunas "Exame do sistema" e "Sugestão".
export type AcgihExamPreviewItem = {
  acgihBeiIndicatorId: string;
  officialIndicatorId: string | null;
  substanceName: string;
  determinant: string;
  matrix: string;
  promoted: boolean;
  riskLinks: Array<{ riskFactorId: string; riskName: string }>;
  examLink: AcgihExamPreviewResult;
};

export type AcgihExamPreviewTotals = {
  indicators: number;
  linked: number;
  linkedPendingConfirmation: number;
  notLinked: number;
  ambiguous: number;
  readyToCreate: number;
  noMatch: number;
};

export type AcgihExamPreviewResponse = {
  totals: AcgihExamPreviewTotals;
  items: AcgihExamPreviewItem[];
};

// ── Resolve (lote) — vincula candidatos seguros e cria exame quando necessário.
export type AcgihExamResolveAction =
  | 'alreadyLinked'
  | 'linkedExistingExam'
  | 'createdExamAndLinked'
  | 'ambiguous'
  | 'blocked'
  | 'failed';

export type AcgihExamResolveItemResult = {
  indicatorId: string;
  substanceName: string;
  determinant: string;
  matrix: string;
  action: AcgihExamResolveAction;
  examId?: number;
  examName?: string;
  candidates?: AcgihExamCandidate[];
  reason?: string;
};

export type AcgihExamResolveTotals = {
  indicators: number;
  alreadyLinked: number;
  linksCreated: number;
  examsCreated: number;
  ambiguous: number;
  blocked: number;
  failed: number;
};

export type AcgihExamResolveResponse = {
  dryRun: boolean;
  totals: AcgihExamResolveTotals;
  items: AcgihExamResolveItemResult[];
};

const isUniqueViolation = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

/**
 * Vincula os exames corretos aos indicadores oficiais ACGIH/BEI, pré-requisito
 * para o sync da Biblioteca Risco × Exame. NÃO cria exame (não inventa), NÃO cria
 * regra da Biblioteca, NÃO cria ExamToRisk em empresa, NÃO altera NR-7/RiskFactor.
 * Única escrita: BiologicalIndicatorToExam (idempotente; P2002 => alreadyLinked).
 */
@Injectable()
export class AcgihExamLinkService {
  constructor(private readonly repository: AcgihExamLinkRepository) {}

  async sync(params: {
    userId: number;
    dryRun?: boolean;
  }): Promise<AcgihExamLinkResponse> {
    const dryRun = params.dryRun === true;

    const [indicators, catalog, nr7ExamLinks] = await Promise.all([
      this.repository.findAcgihOfficialIndicators(),
      this.repository.findSystemicCatalog(),
      this.repository.findNr7ConfirmedExamLinks(),
    ]);

    const items: AcgihExamLinkItemResult[] = [];

    for (const indicator of indicators) {
      const base = {
        indicatorId: indicator.id,
        substanceName: indicator.substanceName,
        determinant: indicator.biologicalIndicatorOriginal,
        matrix: indicator.biologicalMatrix,
      };

      // Já vinculado a algum exame ativo → idempotência.
      const activeLink = indicator.examLinks.find((l) => !l.deleted_at);
      if (activeLink) {
        items.push({
          ...base,
          examId: activeLink.examId,
          action: 'alreadyLinked',
        });
        continue;
      }

      const determinant = indicator.biologicalIndicatorOriginal?.trim();
      if (!determinant) {
        items.push({
          ...base,
          action: 'blocked',
          reason: 'MISSING_DETERMINANT',
        });
        continue;
      }

      const outcome = matchAcgihIndicatorExam({
        indicator: {
          id: indicator.id,
          substanceName: indicator.substanceName,
          determinant: indicator.biologicalIndicatorOriginal,
          determinantNormalized: indicator.biologicalIndicatorNormalized,
          matrix: indicator.biologicalMatrix,
        },
        catalog,
        nr7ExamLinks,
      });

      if (outcome.kind === 'none') {
        items.push({ ...base, action: 'blocked', reason: 'NO_EXAM_MATCH' });
        continue;
      }

      if (outcome.kind === 'ambiguous') {
        items.push({
          ...base,
          action: 'blocked',
          reason: 'AMBIGUOUS_EXAM_MATCH',
          candidates: outcome.candidates,
        });
        continue;
      }

      const { match } = outcome;

      if (dryRun) {
        items.push({
          ...base,
          examId: match.examId,
          examName: match.examName,
          action: 'linkCreated',
        });
        continue;
      }

      try {
        await this.repository.createExamLink({
          indicatorId: indicator.id,
          examId: match.examId,
          matchMethod: match.matchMethod,
          matchConfidence: match.matchConfidence,
          isConfirmed: match.safe,
          requiresReview: !match.safe,
          examNameSnapshot: match.examName,
          examMaterialSnapshot: match.examMaterial,
          notes: this.buildNotes(
            indicator,
            match.reusedFromNr7
              ? 'Reaproveitado de vínculo NR-7 com o mesmo determinante biológico.'
              : 'Vinculado ao exame sistêmico correspondente ao determinante ACGIH/BEI.',
          ),
          userId: params.userId,
        });
        items.push({
          ...base,
          examId: match.examId,
          examName: match.examName,
          action: 'linkCreated',
        });
      } catch (error) {
        if (isUniqueViolation(error)) {
          items.push({
            ...base,
            examId: match.examId,
            examName: match.examName,
            action: 'alreadyLinked',
            reason: 'P2002_ALREADY_LINKED',
          });
          continue;
        }
        items.push({
          ...base,
          action: 'failed',
          reason: undefined,
        });
      }
    }

    return {
      dryRun,
      totals: this.buildTotals(indicators.length, items),
      items,
    };
  }

  /**
   * Estado consolidado (read-only) por indicador ACGIH/BEI para a tela de
   * curadoria: promoção, vínculos de risco e situação do exame do sistema
   * (vinculado / a vincular / ambíguo / a criar / sem dados). Nada é escrito.
   */
  async preview(): Promise<AcgihExamPreviewResponse> {
    const [indicators, catalog, nr7ExamLinks] = await Promise.all([
      this.repository.findAcgihOfficialIndicators(),
      this.repository.findSystemicCatalog(),
      this.repository.findNr7ConfirmedExamLinks(),
    ]);

    const items: AcgihExamPreviewItem[] = indicators.map((indicator) => {
      const activeLink = indicator.examLinks.find((l) => !l.deleted_at) ?? null;
      const snapshot = this.toIndicatorSnapshot(indicator);
      const outcome = matchAcgihIndicatorExam({
        indicator: snapshot,
        catalog,
        nr7ExamLinks,
      });

      const examLink = classifyAcgihExamPreview({
        alreadyLinked: activeLink
          ? {
              examId: activeLink.examId,
              examName: activeLink.examName,
              isConfirmed: activeLink.isConfirmed,
              requiresReview: activeLink.requiresReview,
            }
          : null,
        indicator: snapshot,
        outcome,
      });

      return {
        acgihBeiIndicatorId: indicator.acgihBeiIndicatorId ?? indicator.id,
        officialIndicatorId: indicator.id,
        substanceName: indicator.substanceName,
        determinant: indicator.biologicalIndicatorOriginal,
        matrix: indicator.biologicalMatrix,
        promoted: true,
        riskLinks: indicator.riskLinks.map((link) => ({
          riskFactorId: link.riskFactorId,
          riskName: link.riskName ?? '',
        })),
        examLink,
      };
    });

    return {
      totals: {
        indicators: items.length,
        linked: items.filter((i) => i.examLink.status === 'LINKED').length,
        linkedPendingConfirmation: items.filter(
          (i) => i.examLink.status === 'LINKED_PENDING_CONFIRMATION',
        ).length,
        notLinked: items.filter((i) => i.examLink.status === 'NOT_LINKED')
          .length,
        ambiguous: items.filter((i) => i.examLink.status === 'AMBIGUOUS').length,
        readyToCreate: items.filter(
          (i) => i.examLink.status === 'READY_TO_CREATE',
        ).length,
        noMatch: items.filter((i) => i.examLink.status === 'NO_MATCH').length,
      },
      items,
    };
  }

  /**
   * Resolução em lote: vincula candidatos únicos seguros e, quando não houver
   * candidato seguro e existir determinante+matriz, cria um exame sistêmico e o
   * vincula. Itens ambíguos nunca são resolvidos automaticamente. Idempotente:
   * reusa exame existente por nome normalizado + matriz e nunca duplica vínculo.
   * Única escrita: Exam (sistêmico) e BiologicalIndicatorToExam.
   */
  async resolve(params: {
    userId: number;
    dryRun?: boolean;
    createMissingExams?: boolean;
    linkSafeMatches?: boolean;
  }): Promise<AcgihExamResolveResponse> {
    const dryRun = params.dryRun === true;
    const createMissingExams = params.createMissingExams !== false;
    const linkSafeMatches = params.linkSafeMatches !== false;

    const [indicators, catalog, nr7ExamLinks] = await Promise.all([
      this.repository.findAcgihOfficialIndicators(),
      this.repository.findSystemicCatalog(),
      this.repository.findNr7ConfirmedExamLinks(),
    ]);

    // Pool mutável: exames criados nesta execução entram aqui para evitar
    // duplicidade entre indicadores do mesmo lote.
    const pool: AcgihExamCatalogEntry[] = [...catalog];
    const items: AcgihExamResolveItemResult[] = [];

    for (const indicator of indicators) {
      const base = {
        indicatorId: indicator.id,
        substanceName: indicator.substanceName,
        determinant: indicator.biologicalIndicatorOriginal,
        matrix: indicator.biologicalMatrix,
      };

      const activeLink = indicator.examLinks.find((l) => !l.deleted_at);
      if (activeLink) {
        items.push({
          ...base,
          examId: activeLink.examId,
          examName: activeLink.examName ?? undefined,
          action: 'alreadyLinked',
        });
        continue;
      }

      const determinant = indicator.biologicalIndicatorOriginal?.trim();
      const matrix = indicator.biologicalMatrix?.trim();
      if (!determinant) {
        items.push({ ...base, action: 'blocked', reason: 'MISSING_DETERMINANT' });
        continue;
      }

      const snapshot = this.toIndicatorSnapshot(indicator);
      const outcome = matchAcgihIndicatorExam({
        indicator: snapshot,
        catalog: pool,
        nr7ExamLinks,
      });

      if (outcome.kind === 'ambiguous') {
        items.push({
          ...base,
          action: 'ambiguous',
          candidates: outcome.candidates,
          reason: 'AMBIGUOUS_EXAM_MATCH',
        });
        continue;
      }

      // Candidato único existente → vincular (se habilitado).
      if (outcome.kind === 'matched') {
        if (!linkSafeMatches) {
          items.push({
            ...base,
            examId: outcome.match.examId,
            examName: outcome.match.examName,
            action: 'blocked',
            reason: 'LINK_DISABLED',
          });
          continue;
        }
        const result = await this.linkExisting({
          indicator,
          match: outcome.match,
          dryRun,
          userId: params.userId,
        });
        items.push({ ...base, ...result });
        continue;
      }

      // Sem candidato: criar exame se houver matriz e a criação estiver habilitada.
      if (!matrix) {
        items.push({ ...base, action: 'blocked', reason: 'MISSING_MATRIX' });
        continue;
      }
      if (!createMissingExams) {
        items.push({ ...base, action: 'blocked', reason: 'NO_EXAM_MATCH' });
        continue;
      }

      const result = await this.createAndLink({
        indicator,
        pool,
        dryRun,
        userId: params.userId,
      });
      items.push({ ...base, ...result });
    }

    return { dryRun, totals: this.buildResolveTotals(indicators.length, items), items };
  }

  /** Vincula a um exame existente (ou simula em dryRun). */
  private async linkExisting(params: {
    indicator: AcgihOfficialIndicatorRow;
    match: {
      examId: number;
      examName: string;
      examMaterial: string | null;
      matchMethod: BiologicalIndicatorMatchMethodEnum;
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum;
      safe: boolean;
      reusedFromNr7: boolean;
    };
    dryRun: boolean;
    userId: number;
  }): Promise<Partial<AcgihExamResolveItemResult> & { action: AcgihExamResolveAction }> {
    const { indicator, match, dryRun, userId } = params;
    if (dryRun) {
      return {
        examId: match.examId,
        examName: match.examName,
        action: 'linkedExistingExam',
      };
    }
    try {
      await this.repository.createExamLink({
        indicatorId: indicator.id,
        examId: match.examId,
        matchMethod: match.matchMethod,
        matchConfidence: match.matchConfidence,
        isConfirmed: match.safe,
        requiresReview: !match.safe,
        examNameSnapshot: match.examName,
        examMaterialSnapshot: match.examMaterial,
        notes: this.buildNotes(
          indicator,
          match.reusedFromNr7
            ? 'Reaproveitado de vínculo NR-7 com o mesmo determinante biológico.'
            : 'Vinculado ao exame sistêmico correspondente ao determinante ACGIH/BEI.',
        ),
        userId,
      });
      return {
        examId: match.examId,
        examName: match.examName,
        action: 'linkedExistingExam',
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        return {
          examId: match.examId,
          examName: match.examName,
          action: 'alreadyLinked',
          reason: 'P2002_ALREADY_LINKED',
        };
      }
      return { action: 'failed' };
    }
  }

  /** Cria exame sistêmico (idempotente por nome+matriz) e vincula. */
  private async createAndLink(params: {
    indicator: AcgihOfficialIndicatorRow;
    pool: AcgihExamCatalogEntry[];
    dryRun: boolean;
    userId: number;
  }): Promise<Partial<AcgihExamResolveItemResult> & { action: AcgihExamResolveAction }> {
    const { indicator, pool, dryRun, userId } = params;
    const suggestedName = buildAcgihExamName(
      indicator.biologicalIndicatorOriginal,
      indicator.biologicalMatrix,
    );

    // Idempotência: se já existe exame com nome normalizado + matriz, reusa.
    const existing = this.findExamInPool(pool, suggestedName, indicator.biologicalMatrix);
    if (existing) {
      return this.linkExisting({
        indicator,
        match: {
          examId: existing.id,
          examName: existing.name,
          examMaterial: existing.material,
          matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
          matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
          safe: true,
          reusedFromNr7: false,
        },
        dryRun,
        userId,
      });
    }

    if (dryRun) {
      return { examName: suggestedName, action: 'createdExamAndLinked' };
    }

    try {
      const created = await this.repository.createSystemExam({
        name: suggestedName,
        material: indicator.biologicalMatrix || null,
        obsProc: `Criado a partir do indicador ACGIH/BEI ${indicator.substanceName} (determinante: ${indicator.biologicalIndicatorOriginal}, matriz: ${indicator.biologicalMatrix}).`,
      });
      pool.push(created);

      await this.repository.createExamLink({
        indicatorId: indicator.id,
        examId: created.id,
        matchMethod: BiologicalIndicatorMatchMethodEnum.MANUAL,
        matchConfidence: BiologicalIndicatorMatchConfidenceEnum.MANUAL,
        isConfirmed: true,
        requiresReview: false,
        examNameSnapshot: created.name,
        examMaterialSnapshot: created.material,
        notes: this.buildNotes(
          indicator,
          'Exame sistêmico criado a partir do indicador ACGIH/BEI por confirmação MASTER.',
        ),
        userId,
      });
      return {
        examId: created.id,
        examName: created.name,
        action: 'createdExamAndLinked',
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        return { action: 'alreadyLinked', reason: 'P2002_ALREADY_LINKED' };
      }
      return { action: 'failed' };
    }
  }

  /** Busca no pool um exame por nome normalizado + matriz compatível. */
  private findExamInPool(
    pool: AcgihExamCatalogEntry[],
    name: string,
    matrix: string,
  ): AcgihExamCatalogEntry | null {
    const target = normalizeText(name);
    if (!target) return null;
    const matches = pool.filter(
      (exam) =>
        (normalizeText(exam.name) === target ||
          scoreNameCompatibility(name, exam.name) >= 10) &&
        materialsAreCompatible(exam.material, matrix),
    );
    return matches.length === 1 ? matches[0] : null;
  }

  private toIndicatorSnapshot(indicator: AcgihOfficialIndicatorRow) {
    return {
      id: indicator.id,
      substanceName: indicator.substanceName,
      determinant: indicator.biologicalIndicatorOriginal,
      determinantNormalized: indicator.biologicalIndicatorNormalized,
      matrix: indicator.biologicalMatrix,
    };
  }

  private buildNotes(
    indicator: { substanceName: string; biologicalMatrix: string },
    origin: string,
  ): string {
    return (
      `Vínculo ACGIH/BEI → exame. Substância: ${indicator.substanceName}. ` +
      `Matriz: ${indicator.biologicalMatrix}. ${origin}`
    );
  }

  private buildResolveTotals(
    indicatorCount: number,
    items: AcgihExamResolveItemResult[],
  ): AcgihExamResolveTotals {
    return {
      indicators: indicatorCount,
      alreadyLinked: items.filter((i) => i.action === 'alreadyLinked').length,
      linksCreated: items.filter((i) => i.action === 'linkedExistingExam').length,
      examsCreated: items.filter((i) => i.action === 'createdExamAndLinked')
        .length,
      ambiguous: items.filter((i) => i.action === 'ambiguous').length,
      blocked: items.filter((i) => i.action === 'blocked').length,
      failed: items.filter((i) => i.action === 'failed').length,
    };
  }

  private buildTotals(
    indicatorCount: number,
    items: AcgihExamLinkItemResult[],
  ): AcgihExamLinkTotals {
    return {
      indicators: indicatorCount,
      eligible: items.filter(
        (i) => i.action === 'linkCreated' || i.action === 'alreadyLinked',
      ).length,
      linksCreated: items.filter((i) => i.action === 'linkCreated').length,
      alreadyLinked: items.filter((i) => i.action === 'alreadyLinked').length,
      blocked: items.filter((i) => i.action === 'blocked').length,
      failed: items.filter((i) => i.action === 'failed').length,
    };
  }
}
