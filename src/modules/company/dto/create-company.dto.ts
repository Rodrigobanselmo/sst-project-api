import { QueryArray } from './../../../shared/transformers/query-array';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { CompanyPaymentTypeEnum, CompanyTypesEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsDefined, IsEnum, IsInt, IsOptional, IsString, Length, MaxLength, ValidateIf, ValidateNested } from 'class-validator';

import { CnpjFormatTransform } from '../../../shared/transformers/cnpj-format.transform';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { ActivityDto } from './activity.dto';
import { AddressDto } from './address.dto';
import { LicenseDto } from './license.dto';
import { WorkspaceDto } from './workspace.dto';
import { StringNormalizeTransform } from '../../../shared/transformers/string-normalize.transform';

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
    message: `Tiop de empresa inválido`,
  })
  type: CompanyTypesEnum;

  @IsOptional()
  @IsBoolean()
  isConsulting: boolean;

  @IsBoolean()
  @IsOptional()
  isClinic?: boolean;

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
  @IsDefined()
  @Type(() => ActivityDto)
  readonly primary_activity: ActivityDto[];

  @ValidateNested({ each: true })
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

  @IsOptional()
  @IsInt()
  doctorResponsibleId?: number;

  @IsOptional()
  @IsInt()
  tecResponsibleId?: number;

  @IsBoolean()
  @IsOptional()
  esocialSend?: boolean;
}

export class FindCompaniesDto extends PaginationQueryDto {
  // @Transform(StringNormalizeTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  fantasy?: string;

  @IsInt()
  @IsOptional()
  userId?: number;

  @IsInt()
  @IsOptional()
  groupId?: number;

  @IsBoolean()
  @IsOptional()
  isClinic?: boolean;

  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;

  @IsBoolean()
  @IsOptional()
  findAll?: boolean;

  @IsString()
  @IsOptional()
  clinicsCompanyId?: string;

  @IsBoolean()
  @IsOptional()
  isConsulting?: boolean;

  @IsBoolean()
  @IsOptional()
  isPeriodic?: boolean;
  @IsBoolean()
  @IsOptional()
  isChange?: boolean;
  @IsBoolean()
  @IsOptional()
  isAdmission?: boolean;
  @IsBoolean()
  @IsOptional()
  isReturn?: boolean;
  @IsBoolean()
  @IsOptional()
  isDismissal?: boolean;

  @IsBoolean()
  @IsOptional()
  selectReport?: boolean;

  @IsOptional()
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @Transform(QueryArray, { toClassOnly: true })
  @IsEnum(CompanyTypesEnum, {
    message: `Tiop de empresa inválido`,
    each: true,
  })
  type?: CompanyTypesEnum[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companiesIds?: string[];

  @Transform((t) => QueryArray(t, (v) => Number(v)), { toClassOnly: true })
  @IsInt({ each: true })
  @IsOptional()
  clinicExamsIds?: number[];
}
