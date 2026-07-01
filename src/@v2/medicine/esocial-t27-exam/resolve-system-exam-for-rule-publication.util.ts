import { ExamTypeEnum } from '@prisma/client';

import { normalizeText } from '../biological-indicator/biological-indicator-normalize.util';

export type SystemExamPublicationAction = 'same' | 'reusedGlobal' | 'createdGlobal';

export type ExamForRulePublicationSnapshot = {
  id: number;
  name: string;
  companyId: string;
  system: boolean;
  status: string;
  type: ExamTypeEnum | null;
  material: string | null;
  analyses: string | null;
  instruction: string | null;
  esocial27Code: string | null;
  isAttendance: boolean;
  isAvaliation: boolean;
  obsProc: string | null;
};

export const normalizeExamNameForEquivalence = (name: string): string =>
  normalizeText(name);

const hasNonEmptyEsocial27Code = (code: string | null | undefined): boolean =>
  typeof code === 'string' && code.trim() !== '';

export const optionalFieldsAreCompatible = (
  left: string | null | undefined,
  right: string | null | undefined,
): boolean => {
  const a = left?.trim() || '';
  const b = right?.trim() || '';
  if (!a || !b) return true;
  return normalizeText(a) === normalizeText(b);
};

/**
 * Equivalência segura entre exame local e candidato global:
 * (b) nome normalizado + mesmo type; (c) material/analyses compatíveis quando ambos preenchidos.
 */
export const isGlobalExamEquivalentWithoutCode = (
  source: Pick<
    ExamForRulePublicationSnapshot,
    'name' | 'type' | 'material' | 'analyses'
  >,
  candidate: Pick<
    ExamForRulePublicationSnapshot,
    'name' | 'type' | 'material' | 'analyses'
  >,
): boolean => {
  if (source.type !== candidate.type) return false;
  if (normalizeExamNameForEquivalence(source.name) !== normalizeExamNameForEquivalence(candidate.name)) {
    return false;
  }
  if (!optionalFieldsAreCompatible(source.material, candidate.material)) return false;
  if (!optionalFieldsAreCompatible(source.analyses, candidate.analyses)) return false;
  return true;
};

export const findGlobalEquivalentInCatalog = (
  source: Pick<
    ExamForRulePublicationSnapshot,
    'name' | 'type' | 'material' | 'analyses' | 'esocial27Code'
  >,
  globals: ExamForRulePublicationSnapshot[],
): ExamForRulePublicationSnapshot | null => {
  if (hasNonEmptyEsocial27Code(source.esocial27Code)) {
    const code = source.esocial27Code!.trim();
    const byCode = globals.find(
      (exam) => exam.esocial27Code?.trim() === code,
    );
    if (byCode) return byCode;
  }

  return (
    globals.find((candidate) => isGlobalExamEquivalentWithoutCode(source, candidate)) ??
    null
  );
};
