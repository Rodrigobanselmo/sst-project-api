import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  HoMethodAgentTypeEnum,
  HoMethodAvailabilityStatusEnum,
  HoMethodEvaluationTypeEnum,
  HoMethodLaboratoryAvailabilityStatusEnum,
  HoMethodSourceEnum,
} from '@prisma/client';

import { TransformOptionalNumber } from '../utils/ho-method-number.util';

const toOptionalBoolean = (value: unknown): boolean | undefined => {
  if (value == null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

export class HoMethodEvaluationConditionPayload {
  @IsEnum(HoMethodEvaluationTypeEnum)
  evaluationType!: HoMethodEvaluationTypeEnum;

  @IsOptional()
  @IsString()
  limitValue?: string;

  @IsOptional()
  @IsString()
  limitUnit?: string;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  minimumFlowRate?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  maximumFlowRate?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  minimumVolume?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  maximumVolume?: number;

  @IsOptional()
  @IsString()
  flowRateUnit?: string;

  @IsOptional()
  @IsString()
  volumeUnit?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class HoMethodLaboratoryPayload {
  @IsOptional()
  @IsString()
  laboratoryId?: string;

  @ValidateIf((payload) => !payload.laboratoryId)
  @IsString()
  laboratoryName?: string;

  @IsOptional()
  @IsEnum(HoMethodLaboratoryAvailabilityStatusEnum)
  availabilityStatus?: HoMethodLaboratoryAvailabilityStatusEnum;

  @IsOptional()
  @IsDateString()
  lastConfirmationDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  analyticalNotes?: string;

  @IsOptional()
  @IsString()
  samplerId?: string;

  @IsOptional()
  @IsString()
  extractionSolventId?: string;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  minimumFlowRateOverride?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  maximumFlowRateOverride?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  minimumVolumeOverride?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  maximumVolumeOverride?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  storageTemperatureOverride?: number;

  @IsOptional()
  @IsString()
  storageTemperatureUnitOverride?: string;

  @IsOptional()
  @IsInt()
  stabilityDaysOverride?: number;
}

export class HoMethodAgentPayload {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  riskFactorId!: string;

  @IsOptional()
  @IsString()
  agentName?: string;

  @IsOptional()
  @IsString()
  cas?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsEnum(HoMethodAgentTypeEnum)
  agentType?: HoMethodAgentTypeEnum;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoMethodEvaluationConditionPayload)
  evaluationConditions?: HoMethodEvaluationConditionPayload[];
}

export class HoMethodWritePayload {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  agentName?: string;

  @IsOptional()
  @IsString()
  cas?: string;

  @IsOptional()
  @IsString()
  riskFactorId?: string;

  @IsEnum(HoMethodSourceEnum)
  institution!: HoMethodSourceEnum;

  @IsString()
  methodCode!: string;

  @IsOptional()
  @IsString()
  methodVersion?: string;

  @IsOptional()
  @IsString()
  analyticalMethod?: string;

  @IsOptional()
  @IsEnum(HoMethodAgentTypeEnum)
  agentType?: HoMethodAgentTypeEnum;

  @IsOptional()
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsBoolean()
  prioritized?: boolean;

  @IsOptional()
  @IsEnum(HoMethodAvailabilityStatusEnum)
  status?: HoMethodAvailabilityStatusEnum;

  @IsOptional()
  @IsString()
  samplerId?: string;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  minimumFlowRate?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  maximumFlowRate?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  minimumVolume?: number;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  maximumVolume?: number;

  @IsOptional()
  @IsString()
  flowRateUnit?: string;

  @IsOptional()
  @IsString()
  volumeUnit?: string;

  @IsOptional()
  @TransformOptionalNumber()
  @IsNumber()
  storageTemperature?: number;

  @IsOptional()
  @IsString()
  storageTemperatureUnit?: string;

  @IsOptional()
  @IsInt()
  stabilityDays?: number;

  @IsOptional()
  @IsString()
  extractionSolventId?: string;

  @IsOptional()
  @IsString()
  originalDocumentFileId?: string;

  @IsOptional()
  @IsString()
  originalDocumentName?: string;

  @IsOptional()
  @IsDateString()
  originalDocumentUploadedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoMethodEvaluationConditionPayload)
  evaluationConditions?: HoMethodEvaluationConditionPayload[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoMethodAgentPayload)
  agents?: HoMethodAgentPayload[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoMethodLaboratoryPayload)
  laboratories?: HoMethodLaboratoryPayload[];
}

export class HoMethodBrowseQuery {
  @IsOptional()
  @Transform(({ value }) => Number(value) || 1)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value) || 20)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  agentName?: string;

  @IsOptional()
  @IsString()
  cas?: string;

  @IsOptional()
  @IsEnum(HoMethodSourceEnum)
  institution?: HoMethodSourceEnum;

  @IsOptional()
  @IsString()
  methodCode?: string;

  @IsOptional()
  @IsString()
  analyticalMethod?: string;

  @IsOptional()
  @IsEnum(HoMethodEvaluationTypeEnum)
  evaluationType?: HoMethodEvaluationTypeEnum;

  @IsOptional()
  @IsEnum(HoMethodAvailabilityStatusEnum)
  status?: HoMethodAvailabilityStatusEnum;

  @IsOptional()
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsBoolean()
  prioritized?: boolean;
}

export class HoMethodPath {
  @IsString()
  id!: string;
}

export class HoMethodUploadPath {
  @IsString()
  companyId!: string;
}

export class HoSamplerWritePayload {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class HoExtractionSolventWritePayload {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  synonyms?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class HoMethodRiskSearchQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  companyId?: string;
}

export class HoCatalogBrowseQuery {
  @IsOptional()
  @IsString()
  search?: string;
}

export class HoLaboratoryWritePayload {
  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsString()
  corporateName!: string;

  @IsOptional()
  @IsString()
  tradeName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
