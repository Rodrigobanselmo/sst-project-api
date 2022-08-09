import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  source: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  elaboratedBy: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  approvedBy: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  revisionBy: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  coordinatorBy: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsBoolean()
  isQ5?: boolean;

  @IsOptional()
  @IsBoolean()
  hasEmergencyPlan?: boolean;

  @IsOptional()
  @IsString({ each: true })
  complementarySystems?: string[];

  @IsOptional()
  @IsString({ each: true })
  complementaryDocs: string[];

  // @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  visitDate: Date;

  // @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  validityEnd?: Date;

  // @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  validityStart?: Date;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UsersToRiskDataGroupDto)
  users?: UsersToRiskDataGroupDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ProfessionalToRiskDataGroupDto)
  professionals?: ProfessionalToRiskDataGroupDto[];
}
export class UsersToRiskDataGroupDto {
  @IsOptional()
  @IsString()
  riskFactorGroupDataId: string;

  @IsInt()
  userId: number;

  @IsBoolean()
  @IsOptional()
  isSigner: boolean;

  @IsBoolean()
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
  @IsOptional()
  isSigner: boolean;

  @IsBoolean()
  @IsOptional()
  isElaborator: boolean;
}
