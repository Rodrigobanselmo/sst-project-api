import { BiologicalCollectionMomentEnum } from '@prisma/client';

import { normalizeText } from '../biological-indicator/biological-indicator-normalize.util';

export const EXAM_INSTRUCTION_SEPARATOR = '(//)';

export const NR7_INSTRUCTION_BLOCK_PREFIX = 'Orientação técnica:';
export const ACGIH_INSTRUCTION_BLOCK_PREFIX = 'Orientação técnica ACGIH/BEI:';

export type ExamFieldMergeMode = 'create' | 'preserve';

const COLLECTION_MOMENT_INSTRUCTION_LABELS: Record<
  BiologicalCollectionMomentEnum,
  string
> = {
  [BiologicalCollectionMomentEnum.AJ]: 'antes da jornada (AJ)',
  [BiologicalCollectionMomentEnum.FJ]: 'final da jornada (FJ)',
  [BiologicalCollectionMomentEnum.FJFS]: 'final da jornada e da semana (FJFS)',
  [BiologicalCollectionMomentEnum.AJFS]: 'antes da jornada e final da semana (AJFS)',
  [BiologicalCollectionMomentEnum.AJ48]: 'antes da jornada com 48h (AJ48)',
  [BiologicalCollectionMomentEnum.NC]: 'não crítico (NC)',
  [BiologicalCollectionMomentEnum.FS]: 'final da semana (FS)',
  [BiologicalCollectionMomentEnum.AJ_FJ]: 'antes e final da jornada (AJ-FJ)',
  [BiologicalCollectionMomentEnum.FINAL_EXPOSURE]: 'final da exposição (FINAL_EXPOSURE)',
};

export const isEmptyExamField = (value?: string | null): boolean =>
  !value?.trim();

export const formatCollectionMomentForInstruction = (
  moment: BiologicalCollectionMomentEnum,
): string =>
  COLLECTION_MOMENT_INSTRUCTION_LABELS[moment] ?? moment;

const formatReferenceValue = (
  referenceValue?: string | null,
  unit?: string | null,
): string | null => {
  const value = referenceValue?.trim();
  if (!value) return null;

  const unitText = unit?.trim();
  return unitText ? `${value} ${unitText}` : value;
};

const isMeaningfulObservation = (value?: string | null): boolean => {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  const upper = trimmed.toUpperCase();
  return upper !== '-' && upper !== 'NE';
};

export const instructionContainsTechnicalBlock = (
  instruction: string | null | undefined,
  prefix: string,
): boolean => {
  if (!instruction?.trim()) return false;

  const normalizedInstruction = normalizeText(instruction);
  const normalizedPrefix = normalizeText(prefix);
  return normalizedInstruction.includes(normalizedPrefix);
};

export const mergeExamScalarField = (
  existing: string | null | undefined,
  suggested: string | null | undefined,
  mode: ExamFieldMergeMode,
): string | undefined => {
  const existingValue = existing?.trim();
  const suggestedValue = suggested?.trim();

  if (mode === 'preserve' && existingValue) {
    return existingValue;
  }

  return suggestedValue || existingValue || undefined;
};

export const mergeExamInstruction = (
  existing: string | null | undefined,
  technicalBlock: string | null | undefined,
  mode: ExamFieldMergeMode,
  blockPrefix: string,
): string | undefined => {
  const block = technicalBlock?.trim();
  const existingValue = existing?.trim() || '';

  if (!block) {
    return existingValue || undefined;
  }

  if (existingValue) {
    if (instructionContainsTechnicalBlock(existingValue, blockPrefix)) {
      return existingValue;
    }
    if (mode === 'preserve') {
      return existingValue;
    }
    return `${existingValue}${EXAM_INSTRUCTION_SEPARATOR}${block}`;
  }

  return block;
};

export const buildNr7TechnicalInstructionBlock = (input: {
  collectionMoment: BiologicalCollectionMomentEnum;
  referenceValue?: string | null;
  unit?: string | null;
  technicalObservations?: string | null;
}): string | null => {
  const parts: string[] = [
    `${NR7_INSTRUCTION_BLOCK_PREFIX} coletar em ${formatCollectionMomentForInstruction(input.collectionMoment)}.`,
  ];

  const referenceText = formatReferenceValue(input.referenceValue, input.unit);
  if (referenceText) {
    parts.push(`Valor de referência: ${referenceText}.`);
  }

  if (isMeaningfulObservation(input.technicalObservations)) {
    parts.push(`Observações: ${input.technicalObservations!.trim()}.`);
  }

  return parts.join(' ');
};

export const buildAcgihTechnicalInstructionBlock = (input: {
  samplingMoment?: string | null;
  collectionMoment?: BiologicalCollectionMomentEnum | null;
  referenceValue?: string | null;
  unit?: string | null;
  notation?: string | null;
  technicalObservations?: string | null;
}): string | null => {
  const parts: string[] = [ACGIH_INSTRUCTION_BLOCK_PREFIX];

  const samplingMoment =
    input.samplingMoment?.trim() ||
    (input.collectionMoment
      ? formatCollectionMomentForInstruction(input.collectionMoment)
      : null);

  if (samplingMoment) {
    parts.push(`momento de amostragem ${samplingMoment.toLowerCase()}.`);
  }

  const referenceText = formatReferenceValue(input.referenceValue, input.unit);
  if (referenceText) {
    parts.push(`BEI: ${referenceText}.`);
  }

  const notation = input.notation?.trim();
  if (notation) {
    parts.push(`Notação: ${notation}.`);
  }

  if (isMeaningfulObservation(input.technicalObservations)) {
    parts.push(`Observações: ${input.technicalObservations!.trim()}.`);
  }

  const text = parts.join(' ');
  return text.length > ACGIH_INSTRUCTION_BLOCK_PREFIX.length ? text : null;
};

export const applyExamTechnicalFields = (params: {
  existing?: {
    material?: string | null;
    analyses?: string | null;
    instruction?: string | null;
  } | null;
  suggested: {
    material?: string | null;
    analyses?: string | null;
    instructionBlock?: string | null;
    instructionBlockPrefix?: string;
  };
  mode: ExamFieldMergeMode;
}): {
  material?: string;
  analyses?: string;
  instruction?: string;
} => {
  const prefix =
    params.suggested.instructionBlockPrefix ?? NR7_INSTRUCTION_BLOCK_PREFIX;

  return {
    material: mergeExamScalarField(
      params.existing?.material,
      params.suggested.material,
      params.mode,
    ),
    analyses: mergeExamScalarField(
      params.existing?.analyses,
      params.suggested.analyses,
      params.mode,
    ),
    instruction: mergeExamInstruction(
      params.existing?.instruction,
      params.suggested.instructionBlock,
      params.mode,
      prefix,
    ),
  };
};
