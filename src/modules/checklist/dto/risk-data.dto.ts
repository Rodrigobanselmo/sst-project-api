import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { HomoTypeEnum, Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { EpiRoRiskDataDto as EpiToRiskDataDto } from './epi-risk-data.dto';

export class UpsertRiskDataDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  level?: number;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(HomoTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(HomoTypeEnum)}`,
  })
  type?: HomoTypeEnum;

  @IsOptional()
  @IsNumber()
  probability?: number;

  @IsOptional()
  @IsNumber()
  probabilityAfter?: number;

  @IsString()
  companyId: string;

  @IsString()
  riskId: string;

  @ValidateIf((o) => !o.homogeneousGroupId || o.hierarchyId) //oneOf
  @IsString()
  hierarchyId?: string;

  @ValidateIf((o) => !o.hierarchyId || o.homogeneousGroupId)
  @IsString()
  homogeneousGroupId: string;

  @IsString()
  riskFactorGroupDataId: string;

  @IsString({ each: true })
  @IsOptional()
  recs?: string[];

  @IsString({ each: true })
  @IsOptional()
  engs?: string[];

  @IsString({ each: true })
  @IsOptional()
  adms?: string[];

  @IsOptional()
  @IsString({ each: true })
  generateSources?: string[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => EpiToRiskDataDto)
  epis?: EpiToRiskDataDto[];

  @IsOptional()
  keepEmpty?: boolean;

  @IsOptional()
  json?: Prisma.JsonValue;
}

export class UpsertManyRiskDataDto {
  @IsString()
  @IsOptional()
  id?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(HomoTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(HomoTypeEnum)}`,
  })
  type?: HomoTypeEnum;

  @IsOptional()
  level?: number;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsString({ each: true })
  @IsOptional()
  workspaceIds?: string;

  @IsOptional()
  @IsNumber()
  probability?: number;

  @IsOptional()
  @IsNumber()
  probabilityAfter?: number;

  @IsString()
  companyId: string;

  @IsString()
  @IsOptional()
  riskId: string;

  @IsString({ each: true })
  @IsOptional()
  riskIds: string[];

  @ValidateIf((o) => !o.homogeneousGroupIds || o.hierarchyIds)
  @IsString({ each: true })
  hierarchyIds: string[];

  @ValidateIf((o) => !o.hierarchyIds || o.homogeneousGroupIds)
  @IsString({ each: true })
  homogeneousGroupIds: string[];

  @IsString()
  riskFactorGroupDataId: string;

  @IsString({ each: true })
  @IsOptional()
  recs?: string[];

  @IsString({ each: true })
  @IsOptional()
  engs?: string[];

  @IsString({ each: true })
  @IsOptional()
  adms?: string[];

  @IsOptional()
  @IsString({ each: true })
  generateSources?: string[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => EpiToRiskDataDto)
  epis?: EpiToRiskDataDto[];

  @IsOptional()
  json?: Prisma.JsonValue;
}

export class DeleteManyRiskDataDto {
  @IsString({ each: true })
  @IsOptional()
  riskIds: string[];

  @IsString({ each: true })
  homogeneousGroupIds: string[];
}

export class FindRiskDataDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;
}
