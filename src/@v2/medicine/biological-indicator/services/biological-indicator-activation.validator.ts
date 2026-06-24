import {
  BiologicalIndicatorToExam,
  BiologicalIndicatorToRisk,
  OccupationalBiologicalIndicator,
} from '@prisma/client';

export type BiologicalIndicatorActivationPendency = {
  code: string;
  message: string;
};

type RiskLinkSnapshot = Pick<
  BiologicalIndicatorToRisk,
  'deleted_at' | 'isConfirmed' | 'isPrimary'
>;

type ExamLinkSnapshot = Pick<
  BiologicalIndicatorToExam,
  'deleted_at' | 'isConfirmed' | 'isDefault'
>;

type IndicatorSnapshot = Pick<
  OccupationalBiologicalIndicator,
  'deleted_at' | 'requiresNormativeReview' | 'reviewedAt'
>;

export const getActivationPendencies = (params: {
  indicator: IndicatorSnapshot;
  riskLinks: RiskLinkSnapshot[];
  examLinks: ExamLinkSnapshot[];
  /** Notas enviadas no request de ativação (antes de persistir reviewedAt). */
  activationReviewNotes?: string;
}): BiologicalIndicatorActivationPendency[] => {
  const pendencies: BiologicalIndicatorActivationPendency[] = [];

  if (params.indicator.deleted_at) {
    pendencies.push({
      code: 'INDICATOR_DELETED',
      message: 'Indicador está removido e não pode ser ativado.',
    });
    return pendencies;
  }

  const confirmedRisks = params.riskLinks.filter(
    (link) => !link.deleted_at && link.isConfirmed,
  );

  if (!confirmedRisks.length) {
    pendencies.push({
      code: 'RISK_NOT_CONFIRMED',
      message: 'É necessário confirmar ao menos um vínculo indicador → risco.',
    });
  } else if (confirmedRisks.length > 1) {
    const primaryCount = confirmedRisks.filter((link) => link.isPrimary).length;
    if (primaryCount !== 1) {
      pendencies.push({
        code: 'RISK_PRIMARY_REQUIRED',
        message:
          'Quando houver múltiplos riscos confirmados, exatamente um deve ser principal.',
      });
    }
  }

  const confirmedExams = params.examLinks.filter(
    (link) => !link.deleted_at && link.isConfirmed,
  );

  if (!confirmedExams.length) {
    pendencies.push({
      code: 'EXAM_NOT_CONFIRMED',
      message:
        'É necessário vincular e confirmar ao menos um exame complementar antes da ativação.',
    });
  } else {
    const defaultCount = confirmedExams.filter((link) => link.isDefault).length;
    if (defaultCount !== 1) {
      pendencies.push({
        code: 'EXAM_DEFAULT_REQUIRED',
        message:
          'Entre os exames confirmados, exatamente um deve ser marcado como padrão.',
      });
    }
  }

  if (params.indicator.requiresNormativeReview && !params.indicator.reviewedAt) {
    const hasActivationReviewNotes = Boolean(
      params.activationReviewNotes?.trim(),
    );
    if (!hasActivationReviewNotes) {
      pendencies.push({
        code: 'NORMATIVE_REVIEW_REQUIRED',
        message:
          'Revisão normativa/médica obrigatória ainda não foi registrada para este indicador.',
      });
    }
  }

  return pendencies;
};
