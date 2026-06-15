import { HoMethodRiskFactorSnapshot } from '../ho-method.types';

export type HoMethodImportConfidence = 'high' | 'medium' | 'low';

export type HoMethodImportField<T> = {
  value: T | null;
  confidence: HoMethodImportConfidence;
  rawText?: string | null;
};

export type HoMethodImportAgentSuggestion = {
  substanceName: string;
  cas: string | null;
  synonyms: string[];
  matchedRiskFactor: HoMethodRiskFactorSnapshot | null;
  found: boolean;
};

export type HoMethodImportOccupationalLimitSuggestions = {
  acgihTwa: HoMethodImportField<string>;
  acgihStel: HoMethodImportField<string>;
  acgihCeiling: HoMethodImportField<string>;
  aihaWeel: HoMethodImportField<string>;
  aihaWeelCeiling: HoMethodImportField<string>;
  oshaPel: HoMethodImportField<string>;
  oshaStel: HoMethodImportField<string>;
  oshaCeiling: HoMethodImportField<string>;
  nioshRel: HoMethodImportField<string>;
  nioshStel: HoMethodImportField<string>;
  nioshCeiling: HoMethodImportField<string>;
  nioshIdlh: HoMethodImportField<string>;
};

export type HoMethodImportParseResult = {
  detectedFormat: 'NIOSH' | 'NMAM' | 'UNKNOWN';
  isSupportedMethod: boolean;
  warnings: string[];
  possibleDuplicate: {
    exists: boolean;
    message: string | null;
    existingMethodId: string | null;
  };
  fields: {
    institution: HoMethodImportField<string>;
    methodCode: HoMethodImportField<string>;
    methodVersion: HoMethodImportField<string>;
    issueDate: HoMethodImportField<string>;
    evaluation: HoMethodImportField<string>;
    displayName: HoMethodImportField<string>;
    analyticalMethod: HoMethodImportField<string>;
    sampler: HoMethodImportField<string>;
    minimumFlowRate: HoMethodImportField<number>;
    maximumFlowRate: HoMethodImportField<number>;
    flowRateUnit: HoMethodImportField<string>;
    minimumVolume: HoMethodImportField<number>;
    maximumVolume: HoMethodImportField<number>;
    volumeUnit: HoMethodImportField<string>;
    shipment: HoMethodImportField<string>;
    stabilityDays: HoMethodImportField<number>;
    stabilityText: HoMethodImportField<string>;
    storageTemperature: HoMethodImportField<number>;
    storageTemperatureUnit: HoMethodImportField<string>;
    extractionSolvent: HoMethodImportField<string>;
    technique: HoMethodImportField<string>;
    analyte: HoMethodImportField<string>;
    detector: HoMethodImportField<string>;
    lod: HoMethodImportField<string>;
    range: HoMethodImportField<string>;
    applicability: HoMethodImportField<string>;
    interferences: HoMethodImportField<string>;
    observations: HoMethodImportField<string>;
  };
  occupationalLimits: HoMethodImportOccupationalLimitSuggestions;
  agents: HoMethodImportAgentSuggestion[];
  canConfirm: boolean;
  confirmBlockReason: string | null;
};
