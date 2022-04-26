import { PartialType } from '@nestjs/swagger';
import { MeasuresTypeEnum, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class CreateRecMedDto {
  @IsString()
  riskId: string;

  @IsOptional()
  @IsString()
  recName?: string;

  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(MeasuresTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(MeasuresTypeEnum)}`,
  })
  medType: MeasuresTypeEnum;

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

export class UpsertRecMedDto extends CreateRecMedDto {
  @IsString()
  @IsOptional()
  id: string;
}

export class UpdateRecMedDto {
  @IsOptional()
  @IsString()
  recName?: string;

  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(MeasuresTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(MeasuresTypeEnum)}`,
  })
  medType: MeasuresTypeEnum;

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
  @IsOptional()
  @IsString()
  recName?: string;

  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(MeasuresTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(MeasuresTypeEnum)}`,
  })
  medType: MeasuresTypeEnum;

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
  medType: MeasuresTypeEnum;

  @IsString()
  @IsOptional()
  id: string;
}
