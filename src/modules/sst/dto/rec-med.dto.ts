import { PartialType } from '@nestjs/swagger';
import { MeasuresTypeEnum, RecTypeEnum, RiskFactorsEnum, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { QueryArray } from './../../../shared/transformers/query-array';

import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class CreateRecMedDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  riskId: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  recName?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(MeasuresTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(MeasuresTypeEnum)}`,
  })
  medType?: MeasuresTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(RecTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(RecTypeEnum)}`,
  })
  recType?: RecTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  returnIfExist?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  skipIfExist?: boolean;
}

export class UpsertRecMedDto extends CreateRecMedDto {
  @IsString()
  @IsOptional()
  id: string;
}

export class UpdateRecMedDto {
  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  recName?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(MeasuresTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(MeasuresTypeEnum)}`,
  })
  medType?: MeasuresTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(RecTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(RecTypeEnum)}`,
  })
  recType?: RecTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;
}

export class RiskCreateRecMedDto {
  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  recName?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(MeasuresTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(MeasuresTypeEnum)}`,
  })
  medType?: MeasuresTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(RecTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(RecTypeEnum)}`,
  })
  recType?: RecTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;
}

export class RiskUpdateRecMedDto extends PartialType(RiskCreateRecMedDto) {
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(MeasuresTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(MeasuresTypeEnum)}`,
  })
  medType?: MeasuresTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(RecTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(RecTypeEnum)}`,
  })
  recType?: RecTypeEnum;

  @IsString()
  @IsOptional()
  id: string;
}

export class FindRecMedDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  riskType?: RiskFactorsEnum;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  onlyRec?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  onlyMed?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  representAll?: boolean;

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  riskIds?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(MeasuresTypeEnum, {
    message: `${KeysOfEnum(MeasuresTypeEnum)}`,
    each: true,
  })
  medType?: MeasuresTypeEnum[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(RecTypeEnum, {
    message: `${KeysOfEnum(RecTypeEnum)}`,
    each: true,
  })
  recType?: RecTypeEnum[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
    each: true,
  })
  status?: StatusEnum[];
}
