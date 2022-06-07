import { CompanyTypesEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
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
import { UpdateEmployeeDto } from './employee.dto';
import { UserCompanyEditDto } from './update-user-company.dto';
import { WorkspaceDto } from './workspace.dto';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  companyId: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UserCompanyEditDto)
  users?: UserCompanyEditDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateEmployeeDto)
  employees?: UpdateEmployeeDto[];

  @Transform(CnpjFormatTransform, { toClassOnly: true })
  @IsOptional()
  @Length(18, 18, { message: 'invalid CNPJ' })
  cnpj?: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  fantasy?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(CompanyTypesEnum, {
    message: `type must be one of: ${KeysOfEnum(CompanyTypesEnum)}`,
  })
  type?: CompanyTypesEnum;

  @ValidateNested()
  @IsOptional()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkspaceDto)
  readonly workspace?: WorkspaceDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  readonly primary_activity?: ActivityDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ActivityDto)
  readonly secondary_activity?: ActivityDto[];

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  legal_nature?: string;

  @IsOptional()
  @IsString()
  cadastral_situation?: string;

  @IsOptional()
  @IsString()
  activity_start_date?: string;

  @IsOptional()
  @IsString()
  cadastral_situation_date?: string;

  @IsOptional()
  @IsString()
  legal_nature_code?: string;

  @IsOptional()
  @IsString()
  cadastral_situation_description?: string;
}
