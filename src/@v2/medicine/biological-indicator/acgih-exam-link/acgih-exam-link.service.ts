import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AcgihExamLinkRepository } from './acgih-exam-link.repository';
import {
  AcgihExamCandidate,
  matchAcgihIndicatorExam,
} from './acgih-exam-link.util';

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
          notes: this.buildNotes(indicator, match.reusedFromNr7),
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

  private buildNotes(
    indicator: { substanceName: string; biologicalMatrix: string },
    reusedFromNr7: boolean,
  ): string {
    const origin = reusedFromNr7
      ? 'Reaproveitado de vínculo NR-7 com o mesmo determinante biológico.'
      : 'Vinculado ao exame sistêmico correspondente ao determinante ACGIH/BEI.';
    return (
      `Vínculo ACGIH/BEI → exame. Substância: ${indicator.substanceName}. ` +
      `Matriz: ${indicator.biologicalMatrix}. ${origin}`
    );
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
