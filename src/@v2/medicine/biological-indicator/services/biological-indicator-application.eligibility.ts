import {
  BiologicalIndicatorStatusEnum,
  BiologicalIndicatorToExam,
  BiologicalIndicatorToRisk,
  Exam,
  ExamToRisk,
  OccupationalBiologicalIndicator,
  RiskFactors,
} from '@prisma/client';

import { parseOccupationalApplicability } from '../biological-indicator-applicability.schema';
import { getActivationPendencies } from './biological-indicator-activation.validator';

export type BiologicalIndicatorApplicationBlockCode =
  | 'INDICATOR_NOT_ACTIVE'
  | 'INDICATOR_DELETED'
  | 'RISK_NOT_CONFIRMED'
  | 'RISK_PRIMARY_REQUIRED'
  | 'EXAM_NOT_CONFIRMED'
  | 'EXAM_DEFAULT_REQUIRED'
  | 'NORMATIVE_REVIEW_REQUIRED'
  | 'RISK_NOT_SYSTEM'
  | 'EXAM_NOT_SYSTEM'
  | 'RISK_DELETED'
  | 'EXAM_DELETED'
  | 'RISK_LINK_DELETED'
  | 'EXAM_LINK_DELETED';

export type BiologicalIndicatorApplicationEligibility = {
  isEligible: boolean;
  blockCodes: BiologicalIndicatorApplicationBlockCode[];
  messages: string[];
  primaryRiskLink: IndicatorWithLinks['riskLinks'][number] | null;
  defaultExamLink: IndicatorWithLinks['examLinks'][number] | null;
};

type IndicatorWithLinks = OccupationalBiologicalIndicator & {
  riskLinks: Array<
    BiologicalIndicatorToRisk & {
      riskFactor: Pick<RiskFactors, 'id' | 'name' | 'system' | 'deleted_at'>;
    }
  >;
  examLinks: Array<
    BiologicalIndicatorToExam & {
      exam: Pick<Exam, 'id' | 'name' | 'system' | 'deleted_at'>;
    }
  >;
};

export const validateApplicationEligibility = (
  indicator: IndicatorWithLinks,
): BiologicalIndicatorApplicationEligibility => {
  const blockCodes: BiologicalIndicatorApplicationBlockCode[] = [];
  const messages: string[] = [];

  if (indicator.deleted_at) {
    return {
      isEligible: false,
      blockCodes: ['INDICATOR_DELETED'],
      messages: ['Indicador removido.'],
      primaryRiskLink: null,
      defaultExamLink: null,
    };
  }

  if (indicator.status !== BiologicalIndicatorStatusEnum.ACTIVE) {
    blockCodes.push('INDICATOR_NOT_ACTIVE');
    messages.push('Indicador precisa estar ACTIVE para aplicação operacional.');
  }

  const activationPendencies = getActivationPendencies({
    indicator,
    riskLinks: indicator.riskLinks,
    examLinks: indicator.examLinks,
  });

  activationPendencies.forEach((pendency) => {
    blockCodes.push(pendency.code as BiologicalIndicatorApplicationBlockCode);
    messages.push(pendency.message);
  });

  const confirmedRisks = indicator.riskLinks.filter(
    (link) => !link.deleted_at && link.isConfirmed,
  );
  const primaryRiskLink =
    confirmedRisks.length === 1
      ? confirmedRisks[0]
      : confirmedRisks.find((link) => link.isPrimary) ?? null;

  const confirmedExams = indicator.examLinks.filter(
    (link) => !link.deleted_at && link.isConfirmed,
  );
  const defaultExamLink =
    confirmedExams.length === 1
      ? confirmedExams[0]
      : confirmedExams.find((link) => link.isDefault) ?? null;

  if (primaryRiskLink?.riskFactor?.deleted_at) {
    blockCodes.push('RISK_DELETED');
    messages.push('Risco principal está removido do catálogo.');
  } else if (primaryRiskLink && !primaryRiskLink.riskFactor?.system) {
    blockCodes.push('RISK_NOT_SYSTEM');
    messages.push('Risco principal não pertence ao catálogo sistêmico.');
  }

  if (defaultExamLink?.exam?.deleted_at) {
    blockCodes.push('EXAM_DELETED');
    messages.push('Exame padrão está removido do catálogo.');
  } else if (defaultExamLink && !defaultExamLink.exam?.system) {
    blockCodes.push('EXAM_NOT_SYSTEM');
    messages.push('Exame padrão não pertence ao catálogo sistêmico.');
  }

  const uniqueBlockCodes = [...new Set(blockCodes)];

  return {
    isEligible: uniqueBlockCodes.length === 0 && Boolean(primaryRiskLink && defaultExamLink),
    blockCodes: uniqueBlockCodes,
    messages,
    primaryRiskLink,
    defaultExamLink,
  };
};

export type ApplicationExamToRiskPayload = {
  examId: number;
  riskId: string;
  companyId: string;
  isPeriodic: boolean;
  isAdmission: boolean;
  isReturn: boolean;
  isChange: boolean;
  isDismissal: boolean;
  isFemale: boolean;
  isMale: boolean;
  validityInMonths: number;
  lowValidityInMonths: number | null;
  minRiskDegree: number;
  minRiskDegreeQuantity: number;
};

export type NormativeApplicationTraceability = {
  biologicalIndicatorId: string;
  normativeSource: string;
  normativeIndicatorVersion: string;
  collectionMoment: string;
  collectionToleranceDays: number;
};

export const buildExamToRiskPayload = (
  indicator: OccupationalBiologicalIndicator,
  eligibility: BiologicalIndicatorApplicationEligibility,
  companyId: string,
): ApplicationExamToRiskPayload | null => {
  if (!eligibility.primaryRiskLink || !eligibility.defaultExamLink) {
    return null;
  }

  const applicability = parseOccupationalApplicability(indicator.occupationalApplicability);

  return {
    examId: eligibility.defaultExamLink.examId,
    riskId: eligibility.primaryRiskLink.riskFactorId,
    companyId,
    isPeriodic: applicability.isPeriodic,
    isAdmission: applicability.isAdmission,
    isReturn: applicability.isReturn,
    isChange: applicability.isChange,
    isDismissal: applicability.isDismissal,
    isFemale: false,
    isMale: false,
    validityInMonths: indicator.defaultValidityMonths ?? 6,
    lowValidityInMonths: null,
    minRiskDegree: 1,
    minRiskDegreeQuantity: 1,
  };
};

export const buildNormativeTraceability = (
  indicator: OccupationalBiologicalIndicator,
): NormativeApplicationTraceability => ({
  biologicalIndicatorId: indicator.id,
  normativeSource: indicator.normativeSource,
  normativeIndicatorVersion: indicator.normativeVersion,
  collectionMoment: indicator.collectionMoment,
  collectionToleranceDays: indicator.collectionToleranceDays,
});

export type ExamToRiskComparisonAction = 'CREATE' | 'UPDATE' | 'SKIP' | 'CONFLICT';

export type ExamToRiskComparisonResult = {
  action: ExamToRiskComparisonAction;
  conflictReasons: string[];
  existingExamToRiskId: number | null;
  fieldsToUpdate: Partial<ApplicationExamToRiskPayload>;
};

const OCCUPATIONAL_FLAG_FIELDS = [
  'isPeriodic',
  'isAdmission',
  'isReturn',
  'isChange',
  'isDismissal',
] as const;

export const compareExistingExamToRisk = (
  existing: ExamToRisk | null,
  desired: ApplicationExamToRiskPayload,
): ExamToRiskComparisonResult => {
  if (!existing) {
    return {
      action: 'CREATE',
      conflictReasons: [],
      existingExamToRiskId: null,
      fieldsToUpdate: {},
    };
  }

  const conflictReasons: string[] = [];

  if (existing.considerBetweenDays != null) {
    conflictReasons.push(
      'Regra operacional existente possui considerBetweenDays preenchido (configuração manual).',
    );
  }

  OCCUPATIONAL_FLAG_FIELDS.forEach((field) => {
    if (Boolean(existing[field]) !== Boolean(desired[field])) {
      conflictReasons.push(
        `Divergência em ${field}: existente=${existing[field]}, previsto=${desired[field]}.`,
      );
    }
  });

  if (
    existing.validityInMonths != null &&
    existing.validityInMonths !== desired.validityInMonths
  ) {
    conflictReasons.push(
      `Divergência em validityInMonths: existente=${existing.validityInMonths}, previsto=${desired.validityInMonths}.`,
    );
  }

  if (conflictReasons.length) {
    return {
      action: 'CONFLICT',
      conflictReasons,
      existingExamToRiskId: existing.id,
      fieldsToUpdate: {},
    };
  }

  const fieldsToUpdate: Partial<ApplicationExamToRiskPayload> = {};
  let hasUpdates = false;

  if (existing.validityInMonths == null && desired.validityInMonths != null) {
    fieldsToUpdate.validityInMonths = desired.validityInMonths;
    hasUpdates = true;
  }

  if (existing.lowValidityInMonths == null && desired.lowValidityInMonths != null) {
    fieldsToUpdate.lowValidityInMonths = desired.lowValidityInMonths;
    hasUpdates = true;
  }

  if (existing.minRiskDegree == null && desired.minRiskDegree != null) {
    fieldsToUpdate.minRiskDegree = desired.minRiskDegree;
    hasUpdates = true;
  }

  if (
    existing.minRiskDegreeQuantity == null &&
    desired.minRiskDegreeQuantity != null
  ) {
    fieldsToUpdate.minRiskDegreeQuantity = desired.minRiskDegreeQuantity;
    hasUpdates = true;
  }

  OCCUPATIONAL_FLAG_FIELDS.forEach((field) => {
    if (existing[field] == null && desired[field] != null) {
      fieldsToUpdate[field] = desired[field];
      hasUpdates = true;
    }
  });

  if (hasUpdates) {
    return {
      action: 'UPDATE',
      conflictReasons: [],
      existingExamToRiskId: existing.id,
      fieldsToUpdate,
    };
  }

  return {
    action: 'SKIP',
    conflictReasons: [],
    existingExamToRiskId: existing.id,
    fieldsToUpdate: {},
  };
};
