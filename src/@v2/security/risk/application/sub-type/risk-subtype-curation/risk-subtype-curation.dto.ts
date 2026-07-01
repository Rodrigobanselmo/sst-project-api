import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { StatusEnum } from '@prisma/client';

import {
  RISK_SUBTYPE_CURATION_SUGGEST_ABSOLUTE_MAX,
  RISK_SUBTYPE_CURATION_SUGGEST_DEFAULT_MAX,
} from './constants/risk-subtype-curation-suggest.constants';
import {
  RiskSubtypeBulkAssignModeEnum,
  RiskSubtypeCurationFilterEnum,
} from './risk-subtype-curation.types';

export class BrowseRiskSubtypeCurationRisksQuery {
  @IsOptional()
  @IsEnum(RiskTypeEnum)
  type?: RiskTypeEnum;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyPcmso?: boolean;

  @IsOptional()
  @IsEnum(RiskSubtypeCurationFilterEnum)
  subtypeFilter?: RiskSubtypeCurationFilterEnum = RiskSubtypeCurationFilterEnum.ALL;

  @ValidateIf(
    (query: BrowseRiskSubtypeCurationRisksQuery) =>
      query.subtypeFilter === RiskSubtypeCurationFilterEnum.SPECIFIC,
  )
  @Type(() => Number)
  @IsInt()
  subtypeId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 20;
}

export class BulkAssignRiskSubtypeBody {
  @IsArray()
  @IsUUID('4', { each: true })
  riskFactorIds!: string[];

  @Type(() => Number)
  @IsInt()
  subTypeId!: number;

  @IsOptional()
  @IsEnum(RiskSubtypeBulkAssignModeEnum)
  mode?: RiskSubtypeBulkAssignModeEnum = RiskSubtypeBulkAssignModeEnum.REPLACE;
}

export class BulkClearRiskSubtypeBody {
  @IsArray()
  @IsUUID('4', { each: true })
  riskFactorIds!: string[];
}

export class SuggestRiskSubtypeCandidatesBody {
  @IsEnum(RiskTypeEnum)
  type!: RiskTypeEnum;

  @Type(() => Number)
  @IsInt()
  subTypeId!: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyPcmso?: boolean = true;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(RISK_SUBTYPE_CURATION_SUGGEST_ABSOLUTE_MAX)
  maxCandidates?: number = RISK_SUBTYPE_CURATION_SUGGEST_DEFAULT_MAX;
}
