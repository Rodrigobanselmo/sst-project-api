import { HoMethodImportParseResult } from './ho-method-import.types';
import { HoMethodRiskFactorSnapshot } from '../ho-method.types';

export type HoMethodAiReviewConfidence = 'high' | 'medium' | 'low';

export type HoMethodAiReviewSourceTrace = {
  page?: number | null;
  table?: string | null;
  field: string;
  excerpt: string;
};

export type HoMethodAiReviewOccupationalLimits = {
  nr15Lt?: string | null;
  acgihTwa?: string | null;
  acgihStel?: string | null;
  acgihCeiling?: string | null;
  nioshRel?: string | null;
  nioshStel?: string | null;
  nioshCeiling?: string | null;
  oshaPel?: string | null;
  oshaStel?: string | null;
  oshaCeiling?: string | null;
  aihaWeel?: string | null;
  aihaWeelCeiling?: string | null;
  unit?: string | null;
  notes?: string | null;
};

export type HoMethodAiReviewAgent = {
  name: string;
  cas?: string | null;
  synonyms?: string[];
  translatedNamePtBr?: string | null;
  occupationalLimits?: HoMethodAiReviewOccupationalLimits | null;
  technicalNotes?: string[];
  sourceTrace?: HoMethodAiReviewSourceTrace[];
  confidence: HoMethodAiReviewConfidence;
  warnings?: string[];
  matchedRiskFactor?: HoMethodRiskFactorSnapshot | null;
  matchConfidence?: 'high' | 'low' | 'none';
  candidateRiskFactors?: HoMethodRiskFactorSnapshot[];
};

export type HoMethodAiReviewResult = {
  method?: {
    institution?: string | null;
    methodCode?: string | null;
    issue?: string | null;
    issueDate?: string | null;
    displayName?: string | null;
    analyticalMethod?: string | null;
    evaluation?: string | null;
  } | null;
  agents: HoMethodAiReviewAgent[];
  sampling?: {
    samplerOriginal?: string | null;
    samplerPtBr?: string | null;
    samplerSuggestedMatchId?: string | null;
    samplerSuggestedMatchName?: string | null;
    flowMin?: string | null;
    flowMax?: string | null;
    flowUnit?: string | null;
    volumeMin?: string | null;
    volumeMax?: string | null;
    volumeUnit?: string | null;
    shipment?: string | null;
  } | null;
  preparation?: {
    stabilityDays?: string | null;
    stabilityText?: string | null;
    storageTemperature?: string | null;
    storageTemperatureUnit?: string | null;
    extractionSolventOriginal?: string | null;
    extractionSolventPtBr?: string | null;
    extractionSolventSuggestedMatchId?: string | null;
    extractionSolventSuggestedMatchName?: string | null;
  } | null;
  analytical?: {
    technique?: string | null;
    analyte?: string | null;
    detector?: string | null;
    lod?: string | null;
    range?: string | null;
  } | null;
  observations?: {
    applicability?: string | null;
    interferences?: string | null;
    notes?: string | null;
  } | null;
  diagnostics: {
    detectedTables: Array<{
      label?: string | null;
      title?: string | null;
      page?: number | null;
      inferredPurpose:
        | 'agents'
        | 'limits'
        | 'sampling'
        | 'properties'
        | 'unknown';
      confidence: HoMethodAiReviewConfidence;
    }>;
    parserComparison?: {
      parserAgentCount?: number;
      aiAgentCount?: number;
      differences?: string[];
    } | null;
    warnings?: string[];
  };
};

export type HoMethodImportAiReviewCatalogItem = {
  id: string;
  name: string;
  synonyms?: string[];
};

export namespace IHoMethodImportAiReviewUseCase {
  export type Params = {
    companyId: string;
    originalFileName?: string;
    parserResult: HoMethodImportParseResult;
    extractedText: string;
    customPrompt?: string;
    model?: string;
    registeredSamplers?: HoMethodImportAiReviewCatalogItem[];
    registeredExtractionSolvents?: HoMethodImportAiReviewCatalogItem[];
  };

  export type Result = HoMethodAiReviewResult;
}
