import {
  BiologicalCollectionMomentEnum,
  BiologicalNormativeSourceEnum,
} from '@prisma/client';

import {
  buildAcgihTechnicalInstructionBlock,
  buildNr7TechnicalInstructionBlock,
  isEmptyExamField,
} from './exam-technical-fields.util';
import {
  ExamTechnicalSuggestionResponse,
  ExamTechnicalSuggestionSource,
  IndicatorTechnicalSnapshot,
} from './exam-technical-suggestion.types';

const toCollectionMomentEnum = (
  value: string | null | undefined,
): BiologicalCollectionMomentEnum | null => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return (Object.values(BiologicalCollectionMomentEnum) as string[]).includes(trimmed)
    ? (trimmed as BiologicalCollectionMomentEnum)
    : null;
};

export const buildInstructionFromIndicatorSnapshot = (
  indicator: IndicatorTechnicalSnapshot,
): string | null => {
  const collectionMoment =
    toCollectionMomentEnum(indicator.collectionMoment) ??
    toCollectionMomentEnum(indicator.ruleCollectionMoment);

  const technicalObservations =
    indicator.internalNotes?.trim() ||
    indicator.technicalObservationsRaw?.trim() ||
    null;

  if (indicator.normativeSource === BiologicalNormativeSourceEnum.ACGIH_BEI) {
    return buildAcgihTechnicalInstructionBlock({
      samplingMoment: indicator.samplingTime,
      collectionMoment,
      referenceValue: indicator.referenceValue,
      unit: indicator.unit,
      notation: indicator.notation,
      technicalObservations,
    });
  }

  if (!collectionMoment) return null;

  return buildNr7TechnicalInstructionBlock({
    collectionMoment,
    referenceValue: indicator.referenceValue,
    unit: indicator.unit,
    technicalObservations,
  });
};

export const resolveSuggestionSource = (
  indicators: IndicatorTechnicalSnapshot[],
): ExamTechnicalSuggestionSource => {
  if (!indicators.length) return 'NONE';

  const sources = new Set(
    indicators.map((item) =>
      item.normativeSource === BiologicalNormativeSourceEnum.ACGIH_BEI
        ? 'ACGIH_BEI'
        : 'NR_07',
    ),
  );

  if (sources.size > 1) return 'MIXED';
  return sources.has('ACGIH_BEI') ? 'ACGIH_BEI' : 'NR_07';
};

export const buildExamTechnicalSuggestion = (params: {
  indicators: IndicatorTechnicalSnapshot[];
  exam: {
    material: string | null;
    analyses: string | null;
    instruction: string | null;
  };
}): ExamTechnicalSuggestionResponse => {
  const { indicators, exam } = params;

  if (!indicators.length) {
    return {
      source: 'NONE',
      shouldApply: {
        material: false,
        analyses: false,
        instruction: false,
      },
      notes: [],
    };
  }

  const primary = indicators[0];
  const material = primary.biologicalMatrix?.trim() || undefined;
  const analyses = primary.biologicalIndicatorOriginal?.trim() || undefined;
  const instruction = buildInstructionFromIndicatorSnapshot(primary) ?? undefined;
  const source = resolveSuggestionSource(indicators);

  const shouldApply = {
    material: isEmptyExamField(exam.material) && Boolean(material),
    analyses: isEmptyExamField(exam.analyses) && Boolean(analyses),
    instruction: isEmptyExamField(exam.instruction) && Boolean(instruction),
  };

  const notes: string[] = [];
  if (!isEmptyExamField(exam.material) && material && exam.material?.trim() !== material) {
    notes.push('Sugestão técnica disponível para Matriz/material; campo preservado por já estar preenchido.');
  }
  if (!isEmptyExamField(exam.analyses) && analyses && exam.analyses?.trim() !== analyses) {
    notes.push('Sugestão técnica disponível para Determinante/análise; campo preservado por já estar preenchido.');
  }
  if (!isEmptyExamField(exam.instruction) && instruction) {
    notes.push('Sugestão técnica disponível para Instruções; campo preservado por já estar preenchido.');
  }
  if (source === 'MIXED') {
    notes.push('Sugestão consolidada a partir de indicadores NR-7 e ACGIH/BEI vinculados ao risco.');
  }

  return {
    ...(material ? { material } : {}),
    ...(analyses ? { analyses } : {}),
    ...(instruction ? { instruction } : {}),
    source,
    shouldApply,
    notes,
  };
};
