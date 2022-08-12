import {
  CompanyPaymentTypeEnum,
  CompanyTypesEnum,
  StatusEnum,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
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
  @Length(14, 14, { message: 'invalid CNPJ' })
  cnpj?: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
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
  @IsBoolean()
  isConsulting?: boolean;

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
  logoUrl?: string;

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

  @IsOptional()
  @IsInt()
  numAsos?: number;

  @IsOptional()
  @IsBoolean()
  blockResignationExam?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  esocialStart?: Date;

  @IsOptional()
  @IsString()
  responsibleNit?: string;

  @IsOptional()
  @IsString()
  responsibleCpf?: string;

  @IsOptional()
  @IsString()
  initials?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  stateRegistration?: string;

  @IsOptional()
  @IsInt()
  doctorResponsibleId?: number;

  @IsOptional()
  @IsInt()
  tecResponsibleId?: number;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsInt()
  @IsOptional()
  paymentDay?: number;

  @IsOptional()
  @IsBoolean()
  isTaxNote?: boolean;

  @IsOptional()
  @IsString()
  observationBank?: string;

  @IsOptional()
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsEnum(CompanyPaymentTypeEnum, {
    message: `Tipo de pagamento inválido`,
  })
  paymentType?: CompanyPaymentTypeEnum;
}
