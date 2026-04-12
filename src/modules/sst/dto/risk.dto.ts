import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { GrauInsalubridade, RiskFactorsEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { QueryArray, QueryIntArray } from '../../../shared/transformers/query-array';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { RiskCreateGenerateSourceDto, RiskUpdateGenerateSourceDto, UpsertGenerateSourceDto } from './generate-source.dto';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

import { RiskCreateRecMedDto, RiskUpdateRecMedDto, UpsertRecMedDto } from './rec-med.dto';
import { ActivityTypeEnum } from '../entities/risk.entity';

export class CreateRiskDto {
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(RiskFactorsEnum, {
    message: `type must be one of: ${KeysOfEnum(RiskFactorsEnum)}`,
  })
  type: RiskFactorsEnum;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  subTypesIds?: number[];

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  name: string;

  @IsNumber()
  severity: number;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;

  @IsString()
  @IsOptional()
  esocialCode?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskCreateRecMedDto)
  recMed?: RiskCreateRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskCreateGenerateSourceDto)
  generateSource?: RiskCreateGenerateSourceDto[];

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isAso?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPGR?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPCMSO?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPPP?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isEmergency?: boolean;

  @IsString()
  @IsOptional()
  risk?: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString({ each: true })
  @IsOptional()
  propagation?: string[];

  @IsString({ each: true })
  @IsOptional()
  synonymous?: string[];

  //FIS QUI

  @IsString()
  @IsOptional()
  unit?: string;

  //QUI

  @IsString()
  @IsOptional()
  cas?: string;

  @IsString()
  @IsOptional()
  breather?: string;

  @IsString()
  @IsOptional()
  nr15lt?: string;

  @IsString()
  @IsOptional()
  twa?: string;

  @IsString()
  @IsOptional()
  stel?: string;

  @IsString()
  @IsOptional()
  vmp?: string;

  @IsString()
  @IsOptional()
  ipvs?: string;

  @IsString()
  @IsOptional()
  pv?: string;

  @IsString()
  @IsOptional()
  pe?: string;

  @IsString()
  @IsOptional()
  carnogenicityACGIH?: string;

  @IsString()
  @IsOptional()
  carnogenicityLinach?: string;

  @IsString()
  @IsOptional()
  fraction?: string;

  @IsString()
  @IsOptional()
  tlv?: string;

  @IsString()
  @IsOptional()
  coments?: string;

  @IsString()
  @IsOptional()
  appendix?: string;

  @IsString()
  @IsOptional()
  otherAppendix?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsEnum(GrauInsalubridade, {
    message: `grauInsalubridade must be one of: ${KeysOfEnum(GrauInsalubridade)}`,
  })
  grauInsalubridade?: GrauInsalubridade | null;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ActivityDto)
  activities?: ActivityDto[];
}

export class UpsertRiskDto extends CreateRiskDto {
  @IsString()
  @IsOptional()
  id: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpsertRecMedDto)
  recMed?: UpsertRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpsertGenerateSourceDto)
  generateSource?: UpsertGenerateSourceDto[];
}

export class UpdateRiskDto {
  @IsString()
  id: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(RiskFactorsEnum, {
    message: `type must be one of: ${KeysOfEnum(RiskFactorsEnum)}`,
  })
  type?: RiskFactorsEnum;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  appendix?: string;

  @IsString()
  @IsOptional()
  otherAppendix?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsEnum(GrauInsalubridade, {
    message: `grauInsalubridade must be one of: ${KeysOfEnum(GrauInsalubridade)}`,
  })
  grauInsalubridade?: GrauInsalubridade | null;

  @IsNumber()
  @IsOptional()
  severity?: number;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isEmergency?: boolean;

  @IsString()
  @IsOptional()
  esocialCode?: string;

  @IsString()
  @IsOptional()
  risk?: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString({ each: true })
  @IsOptional()
  propagation?: string[];

  @IsString({ each: true })
  @IsOptional()
  synonymous?: string[];

  //FIS QUI

  @IsString()
  @IsOptional()
  unit?: string;

  //QUI

  @IsString()
  @IsOptional()
  cas?: string;

  @IsString()
  @IsOptional()
  breather?: string;

  @IsString()
  @IsOptional()
  nr15lt?: string;

  @IsString()
  @IsOptional()
  twa?: string;

  @IsString()
  @IsOptional()
  stel?: string;

  @IsString()
  @IsOptional()
  vmp?: string;

  @IsString()
  @IsOptional()
  ipvs?: string;

  @IsString()
  @IsOptional()
  pv?: string;

  @IsString()
  @IsOptional()
  pe?: string;

  @IsString()
  @IsOptional()
  carnogenicityACGIH?: string;

  @IsString()
  @IsOptional()
  carnogenicityLinach?: string;

  @IsString()
  @IsOptional()
  fraction?: string;

  @IsString()
  @IsOptional()
  tlv?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskUpdateRecMedDto)
  recMed?: RiskUpdateRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskUpdateGenerateSourceDto)
  generateSource?: RiskUpdateGenerateSourceDto[];

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isAso?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPGR?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPCMSO?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPPP?: boolean;

  @IsString()
  @IsOptional()
  coments?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ActivityDto)
  activities?: ActivityDto[];

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  subTypesIds?: number[];
}

export enum RiskListSortByEnum {
  TYPE = 'TYPE',
  NAME = 'NAME',
  SEVERITY = 'SEVERITY',
  STATUS = 'STATUS',
}

export class FindRiskDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  companyId: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  representAll: boolean;

  @IsOptional()
  @IsEnum(RiskListSortByEnum)
  listSortBy?: RiskListSortByEnum;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
  @IsIn(['asc', 'desc'])
  listSortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsArray()
  @Transform(QueryArray, { toClassOnly: true })
  @IsEnum(RiskFactorsEnum, { each: true })
  riskTypes?: RiskFactorsEnum[];

  @IsOptional()
  @IsArray()
  @Transform(QueryIntArray, { toClassOnly: true })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(5, { each: true })
  severities?: number[];

  @IsOptional()
  @IsArray()
  @Transform(QueryIntArray, { toClassOnly: true })
  @IsInt({ each: true })
  riskSubTypeIds?: number[];

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  mustIsPGR?: boolean;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  mustIsPPP?: boolean;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  mustIsPCMSO?: boolean;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  mustIsAso?: boolean;
}

export class ActivityDto {
  // @IsString()
  // id: string;

  @IsString()
  description: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(ActivityTypeEnum, {
    message: `activityType must be one of: ${KeysOfEnum(ActivityTypeEnum)}`,
  })
  activityType?: ActivityTypeEnum;

  // @Transform(StringUppercaseTransform, { toClassOnly: true })
  // @IsString()
  // @IsEnum(StatusEnum, { message: `type must be one of: ${KeysOfEnum(StatusEnum)}`, })
  // status: StatusEnum;

  @ValidateNested({ each: true })
  @Type(() => SubActivityDto)
  subActivities: SubActivityDto[];
}

export class SubActivityDto {
  // @IsString()
  // id: string;

  @IsString()
  description: string;

  // @Transform(StringUppercaseTransform, { toClassOnly: true })
  // @IsString()
  // @IsEnum(StatusEnum, { message: `type must be one of: ${KeysOfEnum(StatusEnum)}`, })
  // status: StatusEnum;
}
