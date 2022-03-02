import { RiskFactorsEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StringUppercaseTransform } from 'src/shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from 'src/shared/utils/keysOfEnum.utils';

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
  recMed?: RiskCreateRecMedDto[];
}

export class UpsertRiskDto extends CreateRiskDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpsertRecMedDto)
  recMed?: UpsertRecMedDto[];
}

export class UpdateRiskDto {
  @IsNumber()
  id: number;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(RiskFactorsEnum, {
    message: `type must be one of: ${KeysOfEnum(RiskFactorsEnum)}`,
  })
  type?: RiskFactorsEnum;

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
}
