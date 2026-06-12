import { createHash } from 'crypto';

export type CanonicalQuestionShape = {
  required: boolean;
  text: string;
  type: string;
  acceptOther: boolean;
  system: boolean;
  identifierType: string | null;
  copsoqId: string | null;
  options: Array<{
    order: number;
    text: string;
    value: number | null;
  }>;
  riskNames: string[];
  order?: number;
};

export function buildCanonicalGroupKey(params: {
  kind: 'identifier' | 'content';
  name: string;
  order: number;
}) {
  return `${params.kind}:${params.order}:${params.name.trim().toLowerCase()}`;
}

export function buildCanonicalQuestionKey(question: CanonicalQuestionShape) {
  return createHash('sha256')
    .update(
      JSON.stringify({
        required: question.required,
        text: question.text,
        type: question.type,
        acceptOther: question.acceptOther,
        system: question.system,
        identifierType: question.identifierType,
        copsoqId: question.copsoqId,
        order: question.order ?? null,
        options: question.options,
        riskNames: question.riskNames,
      }),
    )
    .digest('hex');
}

export function buildCanonicalOptionKey(option: {
  order: number;
  text: string;
  value: number | null;
}) {
  return `${option.order}:${option.value ?? 'null'}:${option.text.trim().toLowerCase()}`;
}

export function isMeasurableCanonicalQuestion(question: CanonicalQuestionShape) {
  if (question.copsoqId) return true;

  return (
    question.options.length > 0 &&
    question.options.every(
      (option) =>
        option.value !== null && option.value >= 1 && option.value <= 5,
    ) &&
    question.riskNames.length > 0
  );
}
