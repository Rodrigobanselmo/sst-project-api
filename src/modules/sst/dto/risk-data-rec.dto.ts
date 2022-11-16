import { DateFormat } from '../../../shared/transformers/date-format';
import { RiskRecTextTypeEnum, RiskRecTypeEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class CreateRiskDataRecDto {
  @IsString()
  text: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(RiskRecTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(RiskRecTypeEnum)}`,
  })
  type: RiskRecTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(RiskRecTextTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(RiskRecTextTypeEnum)}`,
  })
  textType: RiskRecTextTypeEnum;
}

export class UpsertRiskDataRecDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  responsibleName?: string;

  @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  riskFactorDataId: string;

  @IsString()
  recMedId: string;

  @IsString()
  companyId: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => CreateRiskDataRecDto)
  comment?: CreateRiskDataRecDto;
}
