import { describe, expect, it } from '@jest/globals';

import { simpleCompanyId } from '../../../../../shared/constants/ids';
import {
  buildExamOrderBy,
  buildExamOriginConstraint,
  ExamOriginEnum,
  resolveExamOrigin,
} from './exam-origin.util';

const CLIENT_COMPANY = 'company-tenant-1';

describe('resolveExamOrigin', () => {
  it('classifica como NR07 quando o exame está vinculado a indicador NR-07', () => {
    const nr07 = new Set<number>([10]);
    const origin = resolveExamOrigin(
      { id: 10, companyId: simpleCompanyId, system: true },
      nr07,
    );
    expect(origin).toBe(ExamOriginEnum.NR07);
  });

  it('NR07 tem precedência mesmo sendo system + simpleCompanyId', () => {
    const nr07 = new Set<number>([5]);
    const origin = resolveExamOrigin(
      { id: 5, companyId: simpleCompanyId, system: true },
      nr07,
    );
    expect(origin).toBe(ExamOriginEnum.NR07);
  });

  it('classifica como SYSTEM quando system + simpleCompanyId e sem link NR-07', () => {
    const origin = resolveExamOrigin(
      { id: 7, companyId: simpleCompanyId, system: true },
      new Set<number>(),
    );
    expect(origin).toBe(ExamOriginEnum.SYSTEM);
  });

  it('classifica como CLIENT quando não é system', () => {
    const origin = resolveExamOrigin(
      { id: 8, companyId: CLIENT_COMPANY, system: false },
      new Set<number>(),
    );
    expect(origin).toBe(ExamOriginEnum.CLIENT);
  });

  it('classifica como OTHER quando system de empresa diferente da simpleCompanyId', () => {
    const origin = resolveExamOrigin(
      { id: 9, companyId: CLIENT_COMPANY, system: true },
      new Set<number>(),
    );
    expect(origin).toBe(ExamOriginEnum.OTHER);
  });
});

describe('buildExamOriginConstraint', () => {
  it('retorna null quando não há filtro de origem', () => {
    expect(buildExamOriginConstraint(undefined, new Set([1]))).toBeNull();
  });

  it('NR07 filtra por ids vinculados', () => {
    const constraint = buildExamOriginConstraint(
      ExamOriginEnum.NR07,
      new Set([1, 2]),
    );
    expect(constraint).toEqual({ id: { in: [1, 2] } });
  });

  it('SYSTEM exige system + simpleCompanyId e exclui ids NR-07', () => {
    const constraint = buildExamOriginConstraint(
      ExamOriginEnum.SYSTEM,
      new Set([3]),
    );
    expect(constraint).toEqual({
      AND: [
        { system: true },
        { companyId: simpleCompanyId },
        { id: { notIn: [3] } },
      ],
    });
  });

  it('CLIENT exige não-system e exclui ids NR-07', () => {
    const constraint = buildExamOriginConstraint(
      ExamOriginEnum.CLIENT,
      new Set([4]),
    );
    expect(constraint).toEqual({
      AND: [{ system: false }, { id: { notIn: [4] } }],
    });
  });

  it('OTHER exige system de empresa diferente da simpleCompanyId', () => {
    const constraint = buildExamOriginConstraint(
      ExamOriginEnum.OTHER,
      new Set([5]),
    );
    expect(constraint).toEqual({
      AND: [
        { system: true },
        { NOT: { companyId: simpleCompanyId } },
        { id: { notIn: [5] } },
      ],
    });
  });
});

describe('buildExamOrderBy', () => {
  it('default é name asc', () => {
    expect(buildExamOrderBy(undefined, undefined)).toEqual({ name: 'asc' });
  });

  it('aplica campo e direção válidos', () => {
    expect(buildExamOrderBy('material', 'desc')).toEqual({ material: 'desc' });
  });

  it('ignora campo não permitido e cai no default', () => {
    expect(buildExamOrderBy('companyId', 'desc')).toEqual({ name: 'asc' });
  });

  it('direção inválida vira asc', () => {
    expect(buildExamOrderBy('status', 'sideways')).toEqual({ status: 'asc' });
  });
});
