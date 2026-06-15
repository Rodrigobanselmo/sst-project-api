import {
  HoExtractionSolvent,
  HoLaboratory,
  HoMethod,
  HoMethodAgent,
  HoMethodEvaluationCondition,
  HoMethodLaboratory,
  HoSampler,
  RiskFactors,
} from '@prisma/client';

import {
  HoExtractionSolventRecord,
  HoLaboratoryRecord,
  HoMethodAgentRecord,
  HoMethodEvaluationConditionRecord,
  HoMethodLaboratoryRecord,
  HoMethodRecord,
  HoMethodRiskFactorSnapshot,
  HoSamplerRecord,
  hoMethodInclude,
} from './ho-method.types';

const toNumber = (value: unknown): number | null => {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const riskFactorOccupationalLimitSelect = {
  id: true,
  name: true,
  cas: true,
  synonymous: true,
  type: true,
  unit: true,
  nr15lt: true,
  twa: true,
  stel: true,
  acgihCeiling: true,
  ipvs: true,
  nioshRel: true,
  nioshStel: true,
  nioshCeiling: true,
  oshaPel: true,
  oshaStel: true,
  oshaCeiling: true,
  aihaWeel: true,
  aihaWeelCeiling: true,
  coments: true,
} as const;

type RiskFactorOccupationalLimitPick = Pick<
  RiskFactors,
  keyof typeof riskFactorOccupationalLimitSelect
>;
type HoMethodWithRelations = HoMethod & {
  sampler?: HoSampler | null;
  extractionSolvent?: HoExtractionSolvent | null;
  riskFactor?: RiskFactorOccupationalLimitPick | null;
  agents?: (HoMethodAgent & {
    riskFactor?: RiskFactorOccupationalLimitPick | null;
    evaluationConditions?: HoMethodEvaluationCondition[];
  })[];
  evaluationConditions?: HoMethodEvaluationCondition[];
  laboratories?: (HoMethodLaboratory & {
    sampler?: HoSampler | null;
    extractionSolvent?: HoExtractionSolvent | null;
    laboratory?: HoLaboratory | null;
  })[];
};

export const mapHoMethodRiskFactorSnapshot = (
  record?: RiskFactorOccupationalLimitPick | null,
): HoMethodRiskFactorSnapshot | null => {
  if (!record) return null;

  return {
    id: record.id,
    name: record.name,
    cas: record.cas,
    synonymous: record.synonymous ?? [],
    type: record.type,
    unit: record.unit,
    nr15lt: record.nr15lt,
    twa: record.twa,
    stel: record.stel,
    acgihCeiling: record.acgihCeiling,
    ipvs: record.ipvs,
    nioshRel: record.nioshRel,
    nioshStel: record.nioshStel,
    nioshCeiling: record.nioshCeiling,
    oshaPel: record.oshaPel,
    oshaStel: record.oshaStel,
    oshaCeiling: record.oshaCeiling,
    aihaWeel: record.aihaWeel,
    aihaWeelCeiling: record.aihaWeelCeiling,
    coments: record.coments,
  };
};

export const mapHoMethodEvaluationCondition = (
  record: HoMethodEvaluationCondition,
): HoMethodEvaluationConditionRecord => ({
  id: record.id,
  hoMethodAgentId: record.hoMethodAgentId,
  evaluationType: record.evaluationType,
  limitValue: record.limitValue,
  limitUnit: record.limitUnit,
  minimumFlowRate: toNumber(record.minimumFlowRate),
  maximumFlowRate: toNumber(record.maximumFlowRate),
  minimumVolume: toNumber(record.minimumVolume),
  maximumVolume: toNumber(record.maximumVolume),
  flowRateUnit: record.flowRateUnit,
  volumeUnit: record.volumeUnit,
  notes: record.notes,
});

export const mapHoMethodAgent = (
  record: HoMethodAgent & {
    riskFactor?: RiskFactorOccupationalLimitPick | null;
    evaluationConditions?: HoMethodEvaluationCondition[];
  },
): HoMethodAgentRecord => ({
  id: record.id,
  riskFactorId: record.riskFactorId,
  agentName: record.agentNameSnapshot,
  cas: record.casSnapshot,
  unit: record.unitSnapshot,
  agentType: record.agentType,
  sortOrder: record.sortOrder,
  riskFactor: mapHoMethodRiskFactorSnapshot(record.riskFactor),
  evaluationConditions: (record.evaluationConditions ?? []).map(
    mapHoMethodEvaluationCondition,
  ),
});

export const mapHoMethodLaboratory = (
  record: HoMethodLaboratory & {
    sampler?: HoSampler | null;
    extractionSolvent?: HoExtractionSolvent | null;
    laboratory?: HoLaboratory | null;
  },
): HoMethodLaboratoryRecord => {
  const structuredName =
    record.laboratory?.tradeName?.trim() ||
    record.laboratory?.corporateName?.trim() ||
    null;

  return {
    id: record.id,
    laboratoryId: record.laboratoryId,
    laboratoryName: structuredName || record.laboratoryName,
    laboratoryCnpj: record.laboratory?.cnpj ?? null,
    laboratoryTradeName: record.laboratory?.tradeName ?? null,
    laboratoryCorporateName: record.laboratory?.corporateName ?? null,
    availabilityStatus: record.availabilityStatus,
  lastConfirmationDate: record.lastConfirmationDate
    ? record.lastConfirmationDate.toISOString()
    : null,
  notes: record.notes,
  analyticalNotes: record.analyticalNotes,
  samplerId: record.samplerId,
  samplerName: record.sampler?.name ?? null,
  extractionSolventId: record.extractionSolventId,
  extractionSolventName: record.extractionSolvent?.name ?? null,
  minimumFlowRateOverride: toNumber(record.minimumFlowRateOverride),
  maximumFlowRateOverride: toNumber(record.maximumFlowRateOverride),
  minimumVolumeOverride: toNumber(record.minimumVolumeOverride),
  maximumVolumeOverride: toNumber(record.maximumVolumeOverride),
  storageTemperatureOverride: toNumber(record.storageTemperatureOverride),
  storageTemperatureUnitOverride: record.storageTemperatureUnitOverride,
  stabilityDaysOverride: record.stabilityDaysOverride,
  };
};

export const mapHoLaboratoryRecord = (
  record: HoLaboratory,
): HoLaboratoryRecord => ({
  id: record.id,
  cnpj: record.cnpj,
  corporateName: record.corporateName,
  tradeName: record.tradeName,
  email: record.email,
  phone: record.phone,
  contactName: record.contactName,
  notes: record.notes,
  status: record.status,
});

export const mapHoMethodRecord = (
  record: HoMethodWithRelations,
  fileMeta?: {
    originalDocumentUrl?: string | null;
    originalDocumentDownloadPath?: string | null;
  },
): HoMethodRecord => {
  const legacyConditions = (record.evaluationConditions ?? []).map(
    mapHoMethodEvaluationCondition,
  );
  let agents = (record.agents ?? []).map(mapHoMethodAgent);

  if (!agents.length && record.riskFactorId) {
    agents = [
      {
        id: `legacy-${record.id}`,
        riskFactorId: record.riskFactorId,
        agentName: record.agentName ?? record.riskFactor?.name ?? null,
        cas: record.cas ?? record.riskFactor?.cas ?? null,
        unit: record.riskFactor?.unit ?? null,
        agentType: record.agentType ?? null,
        sortOrder: 0,
        riskFactor: mapHoMethodRiskFactorSnapshot(record.riskFactor),
        evaluationConditions: legacyConditions,
      },
    ];
  }

  const evaluationConditions =
    agents.length > 0
      ? agents.flatMap((agent) => agent.evaluationConditions)
      : legacyConditions;

  return {
    id: record.id,
    displayName: record.displayName,
    description: record.description,
    agentName: record.agentName,
    cas: record.cas,
    riskFactorId: record.riskFactorId,
    riskFactor: mapHoMethodRiskFactorSnapshot(record.riskFactor),
    institution: record.institution,
    methodCode: record.methodCode,
    methodVersion: record.methodVersion,
    analyticalMethod: record.analyticalMethod,
    agentType: record.agentType,
    prioritized: record.prioritized,
    status: record.status,
    samplerId: record.samplerId,
    samplerName: record.sampler?.name ?? null,
    minimumFlowRate: toNumber(record.minimumFlowRate),
    maximumFlowRate: toNumber(record.maximumFlowRate),
    minimumVolume: toNumber(record.minimumVolume),
    maximumVolume: toNumber(record.maximumVolume),
    flowRateUnit: record.flowRateUnit,
    volumeUnit: record.volumeUnit,
    storageTemperature: toNumber(record.storageTemperature),
    storageTemperatureUnit: record.storageTemperatureUnit,
    stabilityDays: record.stabilityDays,
    extractionSolventId: record.extractionSolventId,
    extractionSolventName: record.extractionSolvent?.name ?? null,
    originalDocumentFileId: record.originalDocumentFileId,
    originalDocumentName: record.originalDocumentName,
    originalDocumentUrl: fileMeta?.originalDocumentUrl ?? null,
    originalDocumentDownloadPath:
      fileMeta?.originalDocumentDownloadPath ?? null,
    originalDocumentUploadedAt: record.originalDocumentUploadedAt
      ? record.originalDocumentUploadedAt.toISOString()
      : null,
    evaluationConditions,
    agents,
    laboratories: (record.laboratories ?? []).map(mapHoMethodLaboratory),
    notes: record.notes,
    createdAt: record.created_at.toISOString(),
    updatedAt: record.updated_at.toISOString(),
  };
};

export const mapHoSamplerRecord = (record: HoSampler): HoSamplerRecord => ({
  id: record.id,
  name: record.name,
  description: record.description,
  type: record.type,
  notes: record.notes,
  active: record.active,
});

export const mapHoExtractionSolventRecord = (
  record: HoExtractionSolvent,
): HoExtractionSolventRecord => ({
  id: record.id,
  name: record.name,
  description: record.description,
  synonyms: record.synonyms ?? [],
  notes: record.notes,
  active: record.active,
});

export const buildDefaultDisplayName = (params: {
  institution: string;
  methodCode: string;
}) => `${params.institution} ${params.methodCode}`.trim();

export { hoMethodInclude };
