import { describe, expect, it } from '@jest/globals';

import { getActivationPendencies } from './biological-indicator-activation.validator';

const baseIndicator = () => ({
  deleted_at: null,
  requiresNormativeReview: false,
  reviewedAt: null,
});

describe('biological-indicator-activation.validator', () => {
  it('bloqueia ativação sem risco confirmado', () => {
    const pendencies = getActivationPendencies({
      indicator: baseIndicator(),
      riskLinks: [],
      examLinks: [{ deleted_at: null, isConfirmed: true, isDefault: true }],
    });

    expect(pendencies.some((item) => item.code === 'RISK_NOT_CONFIRMED')).toBe(true);
  });

  it('bloqueia ativação sem exame confirmado', () => {
    const pendencies = getActivationPendencies({
      indicator: baseIndicator(),
      riskLinks: [{ deleted_at: null, isConfirmed: true, isPrimary: true }],
      examLinks: [],
    });

    expect(pendencies.some((item) => item.code === 'EXAM_NOT_CONFIRMED')).toBe(true);
  });

  it('exige risco principal quando há múltiplos confirmados', () => {
    const pendencies = getActivationPendencies({
      indicator: baseIndicator(),
      riskLinks: [
        { deleted_at: null, isConfirmed: true, isPrimary: false },
        { deleted_at: null, isConfirmed: true, isPrimary: false },
      ],
      examLinks: [{ deleted_at: null, isConfirmed: true, isDefault: true }],
    });

    expect(pendencies.some((item) => item.code === 'RISK_PRIMARY_REQUIRED')).toBe(true);
  });

  it('exige revisão normativa para Quadro 2/grupos', () => {
    const pendencies = getActivationPendencies({
      indicator: {
        ...baseIndicator(),
        requiresNormativeReview: true,
        reviewedAt: null,
      },
      riskLinks: [{ deleted_at: null, isConfirmed: true, isPrimary: true }],
      examLinks: [{ deleted_at: null, isConfirmed: true, isDefault: true }],
    });

    expect(pendencies.some((item) => item.code === 'NORMATIVE_REVIEW_REQUIRED')).toBe(true);
  });

  it('aceita notas de revisão no request de ativação sem reviewedAt prévio', () => {
    const pendencies = getActivationPendencies({
      indicator: {
        ...baseIndicator(),
        requiresNormativeReview: true,
        reviewedAt: null,
      },
      riskLinks: [{ deleted_at: null, isConfirmed: true, isPrimary: true }],
      examLinks: [{ deleted_at: null, isConfirmed: true, isDefault: true }],
      activationReviewNotes: 'Revisão normativa/médica realizada com base na NR-07.',
    });

    expect(pendencies).toHaveLength(0);
  });

  it('bloqueia ativação com notas de revisão vazias', () => {
    const pendencies = getActivationPendencies({
      indicator: {
        ...baseIndicator(),
        requiresNormativeReview: true,
        reviewedAt: null,
      },
      riskLinks: [{ deleted_at: null, isConfirmed: true, isPrimary: true }],
      examLinks: [{ deleted_at: null, isConfirmed: true, isDefault: true }],
      activationReviewNotes: '   ',
    });

    expect(pendencies.some((item) => item.code === 'NORMATIVE_REVIEW_REQUIRED')).toBe(true);
  });

  it('permite ativação quando critérios mínimos são atendidos', () => {
    const pendencies = getActivationPendencies({
      indicator: {
        ...baseIndicator(),
        requiresNormativeReview: true,
        reviewedAt: new Date(),
      },
      riskLinks: [{ deleted_at: null, isConfirmed: true, isPrimary: true }],
      examLinks: [{ deleted_at: null, isConfirmed: true, isDefault: true }],
    });

    expect(pendencies).toHaveLength(0);
  });
});
