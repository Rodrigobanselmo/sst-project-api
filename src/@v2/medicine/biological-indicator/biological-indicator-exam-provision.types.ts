import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTechnicalObservationEnum,
  BiologicalIndicatorTypeEnum,
  BiologicalCollectionMomentEnum,
  ExamTypeEnum,
  StatusEnum,
} from '@prisma/client';

export type Esocial27CatalogEntry = {
  code: string;
  name: string;
};

export type ExamCatalogSnapshot = {
  id: number;
  name: string;
  material: string | null;
  instruction: string | null;
  analyses: string | null;
  esocial27Code: string | null;
  companyId: string;
  system: boolean;
};

export type IndicatorExamProvisionInput = {
  id: string;
  biologicalIndicatorOriginal: string;
  biologicalIndicatorNormalized: string;
  biologicalMatrix: string;
  collectionMoment: BiologicalCollectionMomentEnum;
  tableNumber: BiologicalIndicatorTableEnum;
  indicatorType: BiologicalIndicatorTypeEnum;
  isSubstanceGroup: boolean;
  requiresNormativeReview: boolean;
  referenceValue: string | null;
  unit: string | null;
  technicalObservations: BiologicalIndicatorTechnicalObservationEnum[];
  technicalObservationsRaw: string | null;
  normativeVersion: string;
};

export type ResolvedExamMatch = {
  examId: number;
  examName: string;
  examMaterial: string | null;
  matchMethod: BiologicalIndicatorMatchMethodEnum;
  matchConfidence: BiologicalIndicatorMatchConfidenceEnum;
  matchedViaEsocial: boolean;
  esocial27Code: string | null;
};

export type ExamCreatePayload = {
  name: string;
  companyId: string;
  material: string;
  analyses: string;
  type: ExamTypeEnum;
  system: boolean;
  isAttendance: boolean;
  isAvaliation: boolean;
  status: StatusEnum;
  esocial27Code?: string;
};

export type ExamLinkProvisionPolicy = {
  matchMethod: BiologicalIndicatorMatchMethodEnum;
  matchConfidence: BiologicalIndicatorMatchConfidenceEnum;
  requiresReview: boolean;
  isConfirmed: boolean;
  isDefault: boolean;
};

export type IndicatorExamProvisionSample = {
  indicatorId: string;
  biologicalIndicatorOriginal: string;
  examId: number;
  examName: string;
  examMaterial: string | null;
  action: 'REUSED_EXAM' | 'CREATED_EXAM';
  linkAction: 'CREATED_LINK' | 'REUSED_LINK' | 'UPDATED_LINK';
  esocial27Code: string | null;
  matchedViaEsocial: boolean;
};

export type BiologicalIndicatorExamProvisionReport = {
  indicatorsProcessed: number;
  examsReused: number;
  examsCreated: number;
  linksCreated: number;
  linksReused: number;
  linksUpdated: number;
  invalidLinksSanitized: number;
  indicatorsWithExam: number;
  indicatorsWithoutExam: string[];
  esocialCodesApplied: number;
  samples: IndicatorExamProvisionSample[];
};
