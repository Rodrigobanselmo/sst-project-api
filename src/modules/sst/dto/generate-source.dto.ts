import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { QueryArray } from './../../../shared/transformers/query-array';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { RiskCreateRecMedDto, RiskUpdateRecMedDto } from './rec-med.dto';
import { ToBoolean } from '../../../shared/decorators/boolean.decorator';

export class CreateGenerateSourceDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  riskId: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskCreateRecMedDto)
  recMeds?: RiskCreateRecMedDto[];

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  returnIfExist?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  skipIfExist?: boolean;
}

export class UpsertGenerateSourceDto extends CreateGenerateSourceDto {
  @IsString()
  @IsOptional()
  id: string;
}

export class UpdateGenerateSourceDto {
  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskUpdateRecMedDto)
  recMeds?: RiskUpdateRecMedDto[];
}

export class RiskCreateGenerateSourceDto {
  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;
}

export class RiskUpdateGenerateSourceDto extends RiskCreateGenerateSourceDto {
  @IsString()
  @IsOptional()
  id: string;
}

export class FindGenerateSourceDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  riskType?: RiskFactorsEnum;

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  riskIds?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
    each: true,
  })
  status?: StatusEnum[];
}
