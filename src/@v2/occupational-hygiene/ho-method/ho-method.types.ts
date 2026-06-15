import {
  HoMethodAgentTypeEnum,
  HoMethodAvailabilityStatusEnum,
  HoMethodEvaluationTypeEnum,
  HoMethodLaboratoryAvailabilityStatusEnum,
  HoMethodSourceEnum,
} from '@prisma/client';

export type HoMethodEvaluationConditionInput = {
  id?: string;
  evaluationType: HoMethodEvaluationTypeEnum;
  limitValue?: string | null;
  limitUnit?: string | null;
  minimumFlowRate?: number | null;
  maximumFlowRate?: number | null;
  minimumVolume?: number | null;
  maximumVolume?: number | null;
  flowRateUnit?: string | null;
  volumeUnit?: string | null;
  notes?: string | null;
};

export type HoMethodAgentInput = {
  id?: string;
  riskFactorId: string;
  agentName?: string | null;
  cas?: string | null;
  unit?: string | null;
  agentType?: HoMethodAgentTypeEnum;
  evaluationConditions?: HoMethodEvaluationConditionInput[];
};

export type HoMethodLaboratoryInput = {
  id?: string;
  laboratoryId?: string | null;
  laboratoryName?: string;
  availabilityStatus?: HoMethodLaboratoryAvailabilityStatusEnum;
  lastConfirmationDate?: Date | null;
  notes?: string | null;
  analyticalNotes?: string | null;
  samplerId?: string | null;
  extractionSolventId?: string | null;
  minimumFlowRateOverride?: number | null;
  maximumFlowRateOverride?: number | null;
  minimumVolumeOverride?: number | null;
  maximumVolumeOverride?: number | null;
  storageTemperatureOverride?: number | null;
  storageTemperatureUnitOverride?: string | null;
  stabilityDaysOverride?: number | null;
};

export type HoMethodWriteInput = {
  displayName: string;
  description?: string | null;
  agentName?: string | null;
  cas?: string | null;
  riskFactorId?: string | null;
  institution: HoMethodSourceEnum;
  methodCode: string;
  methodVersion?: string | null;
  analyticalMethod?: string | null;
  agentType?: HoMethodAgentTypeEnum;
  prioritized?: boolean;
  status?: HoMethodAvailabilityStatusEnum;
  samplerId?: string | null;
  minimumFlowRate?: number | null;
  maximumFlowRate?: number | null;
  minimumVolume?: number | null;
  maximumVolume?: number | null;
  flowRateUnit?: string | null;
  volumeUnit?: string | null;
  storageTemperature?: number | null;
  storageTemperatureUnit?: string | null;
  stabilityDays?: number | null;
  extractionSolventId?: string | null;
  originalDocumentFileId?: string | null;
  originalDocumentName?: string | null;
  originalDocumentUploadedAt?: Date | null;
  notes?: string | null;
  evaluationConditions?: HoMethodEvaluationConditionInput[];
  agents?: HoMethodAgentInput[];
  laboratories?: HoMethodLaboratoryInput[];
};

export type HoMethodBrowseFilters = {
  search?: string;
  agentName?: string;
  cas?: string;
  institution?: HoMethodSourceEnum;
  methodCode?: string;
  analyticalMethod?: string;
  evaluationType?: HoMethodEvaluationTypeEnum;
  status?: HoMethodAvailabilityStatusEnum;
  prioritized?: boolean;
};

export type HoMethodEvaluationConditionRecord = {
  id: string;
  hoMethodAgentId: string | null;
  evaluationType: HoMethodEvaluationTypeEnum;
  limitValue: string | null;
  limitUnit: string | null;
  minimumFlowRate: number | null;
  maximumFlowRate: number | null;
  minimumVolume: number | null;
  maximumVolume: number | null;
  flowRateUnit: string | null;
  volumeUnit: string | null;
  notes: string | null;
};

export type HoMethodAgentRecord = {
  id: string;
  riskFactorId: string;
  agentName: string | null;
  cas: string | null;
  unit: string | null;
  agentType: HoMethodAgentTypeEnum | null;
  sortOrder: number;
  riskFactor: HoMethodRiskFactorSnapshot | null;
  evaluationConditions: HoMethodEvaluationConditionRecord[];
};

export type HoMethodLaboratoryRecord = {
  id: string;
  laboratoryId: string | null;
  laboratoryName: string;
  laboratoryCnpj: string | null;
  laboratoryTradeName: string | null;
  laboratoryCorporateName: string | null;
  availabilityStatus: HoMethodLaboratoryAvailabilityStatusEnum;
  lastConfirmationDate: string | null;
  notes: string | null;
  analyticalNotes: string | null;
  samplerId: string | null;
  samplerName: string | null;
  extractionSolventId: string | null;
  extractionSolventName: string | null;
  minimumFlowRateOverride: number | null;
  maximumFlowRateOverride: number | null;
  minimumVolumeOverride: number | null;
  maximumVolumeOverride: number | null;
  storageTemperatureOverride: number | null;
  storageTemperatureUnitOverride: string | null;
  stabilityDaysOverride: number | null;
};

export type HoMethodRiskFactorSnapshot = {
  id: string;
  name: string;
  cas: string | null;
  synonymous: string[];
  type: string;
  unit: string | null;
  nr15lt: string | null;
  twa: string | null;
  stel: string | null;
  acgihCeiling: string | null;
  ipvs: string | null;
  nioshRel: string | null;
  nioshStel: string | null;
  nioshCeiling: string | null;
  oshaPel: string | null;
  oshaStel: string | null;
  oshaCeiling: string | null;
};

export type HoMethodRecord = {
  id: string;
  displayName: string;
  description: string | null;
  agentName: string | null;
  cas: string | null;
  riskFactorId: string | null;
  riskFactor: HoMethodRiskFactorSnapshot | null;
  institution: HoMethodSourceEnum;
  methodCode: string;
  methodVersion: string | null;
  analyticalMethod: string | null;
  agentType: HoMethodAgentTypeEnum;
  prioritized: boolean;
  status: HoMethodAvailabilityStatusEnum;
  samplerId: string | null;
  samplerName: string | null;
  minimumFlowRate: number | null;
  maximumFlowRate: number | null;
  minimumVolume: number | null;
  maximumVolume: number | null;
  flowRateUnit: string | null;
  volumeUnit: string | null;
  storageTemperature: number | null;
  storageTemperatureUnit: string | null;
  stabilityDays: number | null;
  extractionSolventId: string | null;
  extractionSolventName: string | null;
  originalDocumentFileId: string | null;
  originalDocumentName: string | null;
  originalDocumentUrl: string | null;
  originalDocumentDownloadPath: string | null;
  originalDocumentUploadedAt: string | null;
  evaluationConditions: HoMethodEvaluationConditionRecord[];
  agents: HoMethodAgentRecord[];
  laboratories: HoMethodLaboratoryRecord[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HoSamplerRecord = {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  notes: string | null;
  active: boolean;
};

export type HoExtractionSolventRecord = {
  id: string;
  name: string;
  description: string | null;
  synonyms: string[];
  notes: string | null;
  active: boolean;
};

export type HoLaboratoryRecord = {
  id: string;
  cnpj: string | null;
  corporateName: string;
  tradeName: string | null;
  email: string | null;
  phone: string | null;
  contactName: string | null;
  notes: string | null;
  status: 'ACTIVE' | 'INACTIVE';
};

export const hoMethodLegacyInclude = {
  sampler: true,
  extractionSolvent: true,
  riskFactor: {
    select: {
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
    },
  },
  evaluationConditions: {
    orderBy: { evaluationType: 'asc' as const },
  },
  laboratories: {
    where: { deleted_at: null },
    orderBy: { laboratoryName: 'asc' as const },
    include: {
      sampler: true,
      extractionSolvent: true,
      laboratory: true,
    },
  },
} as const;

export const hoMethodInclude = {
  ...hoMethodLegacyInclude,
  agents: {
    where: { deleted_at: null },
    orderBy: [{ sortOrder: 'asc' as const }, { created_at: 'asc' as const }],
    include: {
      riskFactor: {
        select: {
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
        },
      },
      evaluationConditions: {
        orderBy: { evaluationType: 'asc' as const },
      },
    },
  },
};
