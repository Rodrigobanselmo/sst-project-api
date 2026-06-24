import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
  ExamTypeEnum,
  StatusEnum,
} from '@prisma/client';

import { matchIndicatorToExams } from './biological-indicator-exam-match.util';
import {
  ExamCatalogSnapshot,
  Esocial27CatalogEntry,
  ExamCreatePayload,
  ExamLinkProvisionPolicy,
  IndicatorExamProvisionInput,
  ResolvedExamMatch,
} from './biological-indicator-exam-provision.types';
import { BiologicalIndicatorMatchInput } from './biological-indicator-match.types';
import { normalizeText } from './biological-indicator-normalize.util';
import { tokenizeForFuzzyMatch } from './biological-indicator-risk-match.util';
import { simpleCompanyId } from '@/shared/constants/ids';

const MATRIX_SUFFIX_PATTERN =
  /\s+(na|no|em)\s+(urina|sangue|plasma|soro|fezes|ar(\s+exalado(\s+final)?)?)$/i;

export const buildExamCatalogWhere = (companyId: string = simpleCompanyId) => ({
  deleted_at: null,
  OR: [{ companyId }, { system: true }],
});

export const isSystemicCatalogExam = (
  exam: Pick<ExamCatalogSnapshot, 'companyId' | 'system'>,
): boolean => exam.system === true && exam.companyId === simpleCompanyId;

export const isTenantReferenceExam = (
  exam: Pick<ExamCatalogSnapshot, 'companyId' | 'system'>,
): boolean => !isSystemicCatalogExam(exam);

export const filterSystemicCatalogExams = (
  exams: ExamCatalogSnapshot[],
): ExamCatalogSnapshot[] => exams.filter(isSystemicCatalogExam);

export const filterTenantReferenceExams = (
  exams: ExamCatalogSnapshot[],
): ExamCatalogSnapshot[] => exams.filter(isTenantReferenceExam);

export const normalizeEsocialCatalog = (
  entries: Array<{ code: string; 'name '?: string; name?: string }>,
): Esocial27CatalogEntry[] =>
  entries.map((entry) => ({
    code: entry.code,
    name: (entry['name '] ?? entry.name ?? '').trim(),
  }));

export const materialsAreCompatible = (
  examMaterial: string | null | undefined,
  indicatorMatrix: string,
): boolean => {
  const left = normalizeText(examMaterial);
  const right = normalizeText(indicatorMatrix);

  if (!left || !right) return true;
  return left === right || left.includes(right) || right.includes(left);
};

const extractAnalyteCore = (indicatorName: string): string => {
  const trimmed = indicatorName.trim();
  const withoutSuffix = trimmed.replace(MATRIX_SUFFIX_PATTERN, '').trim();
  return withoutSuffix || trimmed;
};

const includesAsDistinctTerm = (haystack: string, needle: string): boolean => {
  if (!needle || needle.length < 4) return false;
  return new RegExp(`(^| )${needle}( |$)`).test(haystack);
};

export const scoreNameCompatibility = (indicatorName: string, examName: string): number => {
  const left = normalizeText(indicatorName);
  const right = normalizeText(examName);

  if (!left || !right) return 0;
  if (left === right) return 10;

  const leftCore = normalizeText(extractAnalyteCore(indicatorName));
  const rightCore = normalizeText(extractAnalyteCore(examName));

  if (leftCore === rightCore) return 9;
  if (includesAsDistinctTerm(left, right) || includesAsDistinctTerm(right, left)) return 8;
  if (includesAsDistinctTerm(leftCore, rightCore) || includesAsDistinctTerm(rightCore, leftCore)) {
    return 7;
  }

  const leftTokens = new Set(tokenizeForFuzzyMatch(leftCore));
  const rightTokens = new Set(tokenizeForFuzzyMatch(rightCore));
  let intersection = 0;
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) intersection += 1;
  });

  if (intersection >= 1) {
    const hasSubstantiveSharedToken = [...leftTokens].some(
      (token) => rightTokens.has(token) && token.length >= 8,
    );
    if (hasSubstantiveSharedToken) return 8;
  }

  return intersection >= 3 ? intersection : 0;
};

const scoreEsocialEntry = (
  indicator: IndicatorExamProvisionInput,
  entry: Esocial27CatalogEntry,
): number => {
  const indicatorNorm = normalizeText(indicator.biologicalIndicatorOriginal);
  const entryNorm = normalizeText(entry.name);

  if (!indicatorNorm || !entryNorm) return 0;

  let score = scoreNameCompatibility(indicator.biologicalIndicatorOriginal, entry.name);

  const matrix = normalizeText(indicator.biologicalMatrix);
  if (matrix.includes('urina')) {
    if (entryNorm.includes('urin')) score += 3;
    if (entryNorm.includes('sangu')) score -= 4;
  }
  if (matrix.includes('sangue')) {
    if (entryNorm.includes('sangu')) score += 3;
    if (entryNorm.includes('urin')) score -= 4;
  }
  if (matrix.includes('exalado')) {
    if (entryNorm.includes('exalado')) score += 4;
    else score -= 2;
  }

  const leftTokens = new Set(
    tokenizeForFuzzyMatch(
      normalizeText(extractAnalyteCore(indicator.biologicalIndicatorOriginal)),
    ),
  );
  const rightTokens = new Set(tokenizeForFuzzyMatch(entryNorm));
  const sharedSubstantiveToken = [...leftTokens].some(
    (token) => rightTokens.has(token) && token.length >= 8,
  );
  if (sharedSubstantiveToken) score += 2;

  return score;
};

export const suggestEsocialEntry = (
  indicator: IndicatorExamProvisionInput,
  catalog: Esocial27CatalogEntry[],
): Esocial27CatalogEntry | null => {
  const scored = catalog
    .map((entry) => ({ entry, score: scoreEsocialEntry(indicator, entry) }))
    .filter((item) => item.score >= 9)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;
  if (scored.length > 1 && scored[0].score === scored[1].score) return null;

  const matrix = normalizeText(indicator.biologicalMatrix);
  const selected = scored[0].entry;
  const selectedNorm = normalizeText(selected.name);

  if (matrix.includes('exalado') && !selectedNorm.includes('exalado')) {
    return null;
  }

  return selected;
};

const toMatchInput = (indicator: IndicatorExamProvisionInput): BiologicalIndicatorMatchInput => ({
  id: indicator.id,
  substanceName: indicator.biologicalIndicatorOriginal,
  substanceNameNormalized: indicator.biologicalIndicatorNormalized,
  casNumbers: [],
  biologicalIndicatorNormalized: indicator.biologicalIndicatorNormalized,
  biologicalMatrix: indicator.biologicalMatrix,
  collectionMoment: indicator.collectionMoment,
  tableNumber: indicator.tableNumber,
  indicatorType: indicator.indicatorType,
  isSubstanceGroup: indicator.isSubstanceGroup,
  requiresNormativeReview: indicator.requiresNormativeReview,
});

const resolveExamCandidateFromPool = (
  indicator: IndicatorExamProvisionInput,
  exams: ExamCatalogSnapshot[],
  esocialCatalog: Esocial27CatalogEntry[],
): ResolvedExamMatch | null => {
  if (!exams.length) return null;

  const exactMatches = exams
    .map((exam) => ({
      exam,
      score: scoreNameCompatibility(indicator.biologicalIndicatorOriginal, exam.name),
      materialOk: materialsAreCompatible(exam.material, indicator.biologicalMatrix),
    }))
    .filter((entry) => entry.score >= 10 && entry.materialOk)
    .sort((a, b) => b.score - a.score);

  if (exactMatches.length === 1) {
    const exam = exactMatches[0].exam;
    return {
      examId: exam.id,
      examName: exam.name,
      examMaterial: exam.material,
      matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
      matchedViaEsocial: false,
      esocial27Code: exam.esocial27Code,
    };
  }

  const partialMatches = exams
    .map((exam) => ({
      exam,
      score: scoreNameCompatibility(indicator.biologicalIndicatorOriginal, exam.name),
      materialOk: materialsAreCompatible(exam.material, indicator.biologicalMatrix),
    }))
    .filter((entry) => entry.score >= 7 && entry.materialOk)
    .sort((a, b) => b.score - a.score);

  if (partialMatches.length === 1) {
    const exam = partialMatches[0].exam;
    return {
      examId: exam.id,
      examName: exam.name,
      examMaterial: exam.material,
      matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
      matchedViaEsocial: false,
      esocial27Code: exam.esocial27Code,
    };
  }

  const suggestedEsocial = suggestEsocialEntry(indicator, esocialCatalog);
  if (suggestedEsocial) {
    const esocialExamMatches = exams.filter(
      (exam) =>
        exam.esocial27Code === suggestedEsocial.code &&
        materialsAreCompatible(exam.material, indicator.biologicalMatrix),
    );

    if (esocialExamMatches.length === 1) {
      const exam = esocialExamMatches[0];
      return {
        examId: exam.id,
        examName: exam.name,
        examMaterial: exam.material,
        matchMethod: BiologicalIndicatorMatchMethodEnum.CATALOG_EQUIVALENCE,
        matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
        matchedViaEsocial: true,
        esocial27Code: exam.esocial27Code,
      };
    }
  }

  const fuzzyMatches = matchIndicatorToExams(
    toMatchInput(indicator),
    exams.map((exam) => ({
      id: exam.id,
      name: exam.name,
      material: exam.material,
      instruction: exam.instruction,
      analyses: exam.analyses,
    })),
  ).filter((match) => {
    const exam = exams.find((item) => item.id === match.examId);
    if (!exam) return false;

    return (
      scoreNameCompatibility(indicator.biologicalIndicatorOriginal, exam.name) >= 7 &&
      materialsAreCompatible(match.examMaterial, indicator.biologicalMatrix)
    );
  });

  if (fuzzyMatches.length === 1) {
    const match = fuzzyMatches[0];
    const exam = exams.find((item) => item.id === match.examId);
    return {
      examId: match.examId,
      examName: match.examName,
      examMaterial: match.examMaterial,
      matchMethod: match.matchMethod,
      matchConfidence: match.matchConfidence,
      matchedViaEsocial: false,
      esocial27Code: exam?.esocial27Code ?? null,
    };
  }

  return null;
};

export const findExistingExamForIndicator = (
  indicator: IndicatorExamProvisionInput,
  exams: ExamCatalogSnapshot[],
  esocialCatalog: Esocial27CatalogEntry[],
): ResolvedExamMatch | null =>
  resolveExamCandidateFromPool(indicator, filterSystemicCatalogExams(exams), esocialCatalog);

export const findTenantReferenceExam = (
  indicator: IndicatorExamProvisionInput,
  exams: ExamCatalogSnapshot[],
  esocialCatalog: Esocial27CatalogEntry[],
): ExamCatalogSnapshot | null => {
  const match = resolveExamCandidateFromPool(
    indicator,
    filterTenantReferenceExams(exams),
    esocialCatalog,
  );

  if (!match) return null;
  return exams.find((exam) => exam.id === match.examId) ?? null;
};

export const buildExamCreatePayload = (
  indicator: IndicatorExamProvisionInput,
  esocialCatalog: Esocial27CatalogEntry[],
  referenceExam?: ExamCatalogSnapshot | null,
): ExamCreatePayload => {
  const suggestedEsocial = suggestEsocialEntry(indicator, esocialCatalog);
  const referenceEsocialCode = referenceExam?.esocial27Code?.trim() || undefined;
  const esocial27Code = suggestedEsocial?.code ?? referenceEsocialCode;

  const analyses =
    referenceExam?.analyses?.trim() || indicator.biologicalIndicatorOriginal;

  return {
    name: indicator.biologicalIndicatorOriginal,
    companyId: simpleCompanyId,
    material: indicator.biologicalMatrix,
    analyses,
    type: ExamTypeEnum.LAB,
    system: true,
    isAttendance: false,
    isAvaliation: false,
    status: StatusEnum.ACTIVE,
    ...(esocial27Code ? { esocial27Code } : {}),
  };
};

export const buildNormativeExamLinkNotes = (
  indicator: IndicatorExamProvisionInput,
  referenceExam?: ExamCatalogSnapshot | null,
): string => {
  const tableLabel =
    indicator.tableNumber === BiologicalIndicatorTableEnum.QUADRO_2
      ? 'Quadro 2'
      : 'Quadro 1';

  const observations =
    indicator.technicalObservationsRaw?.trim() ||
    (indicator.technicalObservations.length
      ? indicator.technicalObservations.join(', ')
      : '-');

  const value =
    indicator.referenceValue && indicator.unit
      ? `${indicator.referenceValue} ${indicator.unit}`
      : indicator.referenceValue ?? '-';

  const referenceNote = referenceExam
    ? `Referência de cadastro externo: exame ${referenceExam.id} (${referenceExam.name}).`
    : null;

  return [
    `NR-07 Anexo I, ${tableLabel}.`,
    `Indicador: ${indicator.biologicalIndicatorOriginal}.`,
    `Matriz: ${indicator.biologicalMatrix}.`,
    `Momento da coleta: ${indicator.collectionMoment}.`,
    `Valor IBE/EE: ${value}.`,
    `Observações: ${observations}.`,
    referenceNote,
    'Provisionado automaticamente da linha normativa.',
  ]
    .filter(Boolean)
    .join(' ');
};

export const buildExamLinkProvisionPolicy = (
  indicator: IndicatorExamProvisionInput,
): ExamLinkProvisionPolicy => {
  const requiresReview =
    indicator.requiresNormativeReview ||
    indicator.isSubstanceGroup ||
    indicator.tableNumber === BiologicalIndicatorTableEnum.QUADRO_2 ||
    indicator.indicatorType === BiologicalIndicatorTypeEnum.IBE_SC;

  return {
    matchMethod: BiologicalIndicatorMatchMethodEnum.CATALOG_EQUIVALENCE,
    matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
    requiresReview,
    isConfirmed: !requiresReview,
    isDefault: true,
  };
};
