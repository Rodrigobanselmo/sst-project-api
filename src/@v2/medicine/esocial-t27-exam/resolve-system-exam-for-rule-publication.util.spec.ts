import { describe, expect, it } from '@jest/globals';
import { ExamTypeEnum } from '@prisma/client';

import {
  ExamForRulePublicationSnapshot,
  findGlobalEquivalentInCatalog,
  isGlobalExamEquivalentWithoutCode,
  normalizeExamNameForEquivalence,
} from './resolve-system-exam-for-rule-publication.util';

const baseExam = (
  overrides: Partial<ExamForRulePublicationSnapshot> = {},
): ExamForRulePublicationSnapshot => ({
  id: 1,
  name: 'Hemograma com contagem de plaquetas ou frações (eritrograma, leucograma, plaquetas)',
  companyId: 'tenant-1',
  system: false,
  status: 'ACTIVE',
  type: ExamTypeEnum.LAB,
  material: null,
  analyses: null,
  instruction: null,
  esocial27Code: '0693',
  isAttendance: false,
  isAvaliation: false,
  obsProc: null,
  ...overrides,
});

describe('resolve-system-exam-for-rule-publication.util', () => {
  it('normaliza nome para equivalência sem acentos e caixa', () => {
    expect(
      normalizeExamNameForEquivalence(
        'Hemograma com CONTAGEM de Plaquetas',
      ),
    ).toContain('hemograma');
  });

  it('equivalência por esocial27Code tem prioridade sobre nome', () => {
    const source = baseExam({ id: 6, esocial27Code: '0693' });
    const globals = [
      baseExam({ id: 70, system: true, esocial27Code: '0693' }),
      baseExam({
        id: 99,
        system: true,
        name: 'Outro exame',
        esocial27Code: '0693',
      }),
    ];

    expect(findGlobalEquivalentInCatalog(source, globals)?.id).toBe(70);
  });

  it('sem código eSocial, exige nome+tipo e material/analyses compatíveis', () => {
    const source = baseExam({
      esocial27Code: null,
      material: 'Sangue',
      analyses: 'Hemograma',
    });
    const match = baseExam({
      id: 70,
      system: true,
      esocial27Code: null,
      material: 'Sangue',
      analyses: 'Hemograma',
    });
    const mismatchType = baseExam({
      id: 71,
      system: true,
      esocial27Code: null,
      type: ExamTypeEnum.OTHERS,
    });

    expect(isGlobalExamEquivalentWithoutCode(source, match)).toBe(true);
    expect(isGlobalExamEquivalentWithoutCode(source, mismatchType)).toBe(false);
    expect(findGlobalEquivalentInCatalog(source, [match, mismatchType])?.id).toBe(70);
  });

  it('material/analyses vazios em um dos lados não bloqueiam equivalência', () => {
    const source = baseExam({ esocial27Code: null, material: null, analyses: null });
    const candidate = baseExam({
      id: 70,
      system: true,
      esocial27Code: null,
      material: 'Sangue',
      analyses: 'Hemograma',
    });

    expect(isGlobalExamEquivalentWithoutCode(source, candidate)).toBe(true);
  });
});
