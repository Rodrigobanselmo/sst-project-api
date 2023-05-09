import { QueryArray } from './../../../shared/transformers/query-array';
import { PartialType } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ToBoolean } from '../../../shared/decorators/boolean.decorator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { DateFormat } from '../../../shared/transformers/date-format';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { CreateEmployeeExamHistoryDto, UpdateEmployeeExamHistoryDto } from './employee-exam-history';

export class CreateScheduleMedicalVisitDto {
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  doneClinicDate: Date;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  doneLabDate: Date;

  @IsString()
  companyId: string;

  @IsString()
  @IsOptional()
  clinicId?: string;

  @IsString()
  @IsOptional()
  labId?: string;

  @IsInt()
  @IsOptional()
  docId?: number;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `Status inválido`,
  })
  status: StatusEnum;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateEmployeeExamHistoryDto)
  readonly exams?: CreateEmployeeExamHistoryDto[];
}

export class UpdateScheduleMedicalVisitDto extends PartialType(CreateScheduleMedicalVisitDto) {
  @IsInt()
  @IsOptional()
  id: number;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateEmployeeExamHistoryDto)
  readonly exams?: CreateEmployeeExamHistoryDto[];
}

export class FindScheduleMedicalVisitDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  onlyCompany?: boolean;

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
}
