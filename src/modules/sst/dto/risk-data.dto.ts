import { DateFormat } from './../../../shared/transformers/date-format';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { ExposureTypeEnum, HomoTypeEnum, Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { EpiRoRiskDataDto } from './epi-risk-data.dto';
import { EngsRiskDataDto } from './engs-risk-data.dto';
import { ExamsRiskDataDto } from './exams-risk-data.dto';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';
import { UpdateRecMedDto } from './rec-med.dto';
import { UpdateGenerateSourceDto } from './generate-source.dto';

export class UpsertRiskDataDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  createId?: string;

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

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ExposureTypeEnum, { message: `type must be one of: ${KeysOfEnum(ExposureTypeEnum)}` })
  exposure?: ExposureTypeEnum;

  @IsOptional()
  @IsNumber()
  probabilityAfter?: number;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  standardExams?: boolean;

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
  @IsOptional()
  riskFactorGroupDataId: string;

  @IsString({ each: true })
  @IsOptional()
  recs?: string[];

  @IsString({ each: true })
  @IsOptional()
  adms?: string[];

  @IsOptional()
  @IsString({ each: true })
  generateSources?: string[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => EpiRoRiskDataDto)
  epis?: EpiRoRiskDataDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => EngsRiskDataDto)
  engs?: EngsRiskDataDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ExamsRiskDataDto)
  exams?: ExamsRiskDataDto[];

  @IsOptional()
  keepEmpty?: boolean;

  @IsOptional()
  json?: Prisma.JsonValue;

  @IsOptional()
  activities?: Prisma.JsonValue;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de fim inválida' })
  @Type(() => Date)
  endDate?: Date;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateRecMedDto)
  recAddOnly?: UpdateRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateRecMedDto)
  admsAddOnly?: UpdateRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateGenerateSourceDto)
  generateSourcesAddOnly?: UpdateGenerateSourceDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateRecMedDto)
  engsAddOnly?: UpdateRecMedDto[];
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

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ExposureTypeEnum, { message: `type must be one of: ${KeysOfEnum(ExposureTypeEnum)}` })
  exposure?: ExposureTypeEnum;

  @IsOptional()
  @IsNumber()
  probability?: number;

  @IsOptional()
  @IsNumber()
  probabilityAfter?: number;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  standardExams?: boolean;

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
  adms?: string[];

  @IsOptional()
  @IsString({ each: true })
  generateSources?: string[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => EpiRoRiskDataDto)
  epis?: EpiRoRiskDataDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => EngsRiskDataDto)
  engs?: EngsRiskDataDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ExamsRiskDataDto)
  exams?: ExamsRiskDataDto[];

  @IsOptional()
  json?: Prisma.JsonValue;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de fim inválida' })
  @Type(() => Date)
  endDate?: Date;
}

export class DeleteManyRiskDataDto {
  // @IsString({ each: true })
  // @IsOptional()
  // riskIds: string[];

  // @IsOptional()
  // @IsString({ each: true })
  // homogeneousGroupIds: string[];

  @IsString({ each: true })
  ids: string[];
}

export class FindRiskDataDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;
}
