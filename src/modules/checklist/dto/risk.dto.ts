import { RiskFactorsEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import {
  RiskCreateGenerateSourceDto,
  RiskUpdateGenerateSourceDto,
  UpsertGenerateSourceDto,
} from './generate-source.dto';

import {
  RiskCreateRecMedDto,
  RiskUpdateRecMedDto,
  UpsertRecMedDto,
} from './rec-med.dto';

export class CreateRiskDto {
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(RiskFactorsEnum, {
    message: `type must be one of: ${KeysOfEnum(RiskFactorsEnum)}`,
  })
  type: RiskFactorsEnum;

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

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskCreateRecMedDto)
  recMed?: RiskCreateRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskCreateGenerateSourceDto)
  generateSource?: RiskCreateGenerateSourceDto[];
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
  recMed?: RiskUpdateRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskUpdateGenerateSourceDto)
  generateSource?: RiskUpdateGenerateSourceDto[];
}
