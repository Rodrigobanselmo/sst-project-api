import { QueryArray } from '../../../shared/transformers/query-array';
import { PartialType } from '@nestjs/swagger';
import { ExamHistoryEvaluationEnum, SexTypeEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { CpfFormatTransform } from '../../../shared/transformers/cpf-format.transform';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { ErrorCompanyEnum } from './../../../shared/constants/enum/errorMessage';
import { DateFormat } from './../../../shared/transformers/date-format';

export class CreateEmployeeDto {
  @Transform(CpfFormatTransform, { toClassOnly: true })
  @Length(11, 11, { message: ErrorCompanyEnum.INVALID_CPF })
  cpf: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${StatusEnum.ACTIVE} or ${StatusEnum.INACTIVE}`,
  })
  status: StatusEnum;

  @IsString()
  companyId: string;

  @IsString()
  @IsOptional()
  hierarchyId: string;

  @IsString()
  @IsOptional()
  cbo: string;

  @IsString()
  @IsOptional()
  esocialCode: string;

  @IsString()
  @IsOptional()
  socialName: string;

  @IsString()
  @IsOptional()
  nickname: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isComorbidity: boolean;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(SexTypeEnum, {
    message: `Sexo inválido`,
  })
  sex: SexTypeEnum;

  // @IsString({ each: true })
  @IsString()
  @IsOptional()
  cidId: string;
  // cidId: string[];

  @IsInt()
  @IsOptional()
  shiftId: number;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de aniversário inválida' })
  @Type(() => Date)
  birthday: Date;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  companyId: string;
}

export class DeleteSubOfficeEmployeeDto {
  @IsNumber()
  id: number;

  @IsString()
  subOfficeId: string;

  @IsString()
  companyId: string;
}

export class FindEmployeeDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  hierarchyId?: string;

  @IsString()
  @IsOptional()
  hierarchySubOfficeId?: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  all?: boolean;

  @IsOptional()
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  lteExpiredDateExam: Date;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  expiredExam?: boolean;

  @IsOptional()
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  expiredDateExam: Date;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companiesIds?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companiesGroupIds?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  cities?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  uf?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${StatusEnum.ACTIVE} or ${StatusEnum.INACTIVE}`,
    each: true,
  })
  status: StatusEnum[];
}

export class FindOneEmployeeDto {
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  absenteeismLast60Days?: boolean;
}
