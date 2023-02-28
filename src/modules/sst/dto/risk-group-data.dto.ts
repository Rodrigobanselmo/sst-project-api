import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class UpsertRiskGroupDataDto {
  @IsString()
  @IsOptional()
  id?: string;

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

  @IsOptional()
  @IsString()
  companyId: string;
}
export class UsersToRiskDataGroupDto {
  @IsOptional()
  @IsString()
  riskFactorGroupDataId: string;

  @IsInt()
  userId: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isSigner: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isElaborator: boolean;
}
export class ProfessionalToRiskDataGroupDto {
  @IsOptional()
  @IsString()
  riskFactorGroupDataId: string;

  @IsInt()
  professionalId: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isSigner: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isElaborator: boolean;
}
