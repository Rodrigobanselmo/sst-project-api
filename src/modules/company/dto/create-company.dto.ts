import { CompanyTypesEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { CnpjFormatTransform } from '../../../shared/transformers/cnpj-format.transform';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { ActivityDto } from './activity.dto';
import { AddressDto } from './address.dto';
import { LicenseDto } from './license.dto';
import { WorkspaceDto } from './workspace.dto';

export class CreateCompanyDto {
  @Transform(CnpjFormatTransform, { toClassOnly: true })
  @Length(14, 14, { message: 'invalid CNPJ' })
  cnpj: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(500)
  name: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  fantasy: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status: StatusEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(CompanyTypesEnum, {
    message: `type must be one of: ${KeysOfEnum(CompanyTypesEnum)}`,
  })
  type: CompanyTypesEnum;

  @IsOptional()
  @IsBoolean()
  isConsulting: boolean;

  @ValidateNested()
  @IsOptional()
  @Type(() => LicenseDto)
  license?: LicenseDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ValidateNested({ each: true })
  // @IsDefined()
  // @ArrayNotEmpty()
  @Type(() => WorkspaceDto)
  readonly workspace: WorkspaceDto[];

  @ValidateNested({ each: true })
  // @IsDefined()
  @Type(() => ActivityDto)
  readonly primary_activity: ActivityDto[];

  @ValidateNested({ each: true })
  // @IsDefined()
  @Type(() => ActivityDto)
  readonly secondary_activity: ActivityDto[];

  @IsOptional()
  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  legal_nature: string;

  @IsOptional()
  @IsString()
  cadastral_situation: string;

  @IsOptional()
  @IsString()
  activity_start_date: string;

  @IsOptional()
  @IsString()
  cadastral_situation_date: string;

  @IsOptional()
  @IsString()
  legal_nature_code: string;

  @IsOptional()
  @IsString()
  cadastral_situation_description: string;

  @IsOptional()
  @IsInt()
  riskDegree?: number;

  @IsOptional()
  @IsString()
  operationTime?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  responsibleName?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
