import { DateFormat } from './../../../shared/transformers/date-format';
import { QueryArray, QueryIntArray } from '../../../shared/transformers/query-array';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DateUnitEnum, StatusEnum } from '@prisma/client';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';
import { AbsenteeismListSortByEnum } from './absenteeism-list-sort.enum';

export class CreateAbsenteeismDto {
  // @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startDate: Date;

  // @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de fim inválida' })
  @Type(() => Date)
  endDate: Date;

  // @IsInt()
  // @IsOptional()
  // startTime: number;

  // @IsInt()
  // @IsOptional()
  // endTime: number;

  @IsInt()
  @IsOptional()
  docId?: number;

  @IsString()
  @IsOptional()
  @IsEnum(DateUnitEnum, {
    message: `Unidade de Data inválida`,
  })
  timeUnit: DateUnitEnum;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isJustified?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isExtern?: boolean;

  @IsString()
  @IsOptional()
  local?: string;

  @IsString()
  @IsOptional()
  observation?: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  sameAsBefore?: boolean;

  @IsInt()
  @IsOptional()
  traffic?: number;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  vacationStartDate?: Date;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de fim inválida' })
  @Type(() => Date)
  vacationEndDate?: Date;

  @IsString()
  @IsOptional()
  cnpjSind?: string;

  @IsInt()
  @IsOptional()
  infOnusRemun?: number;

  @IsString()
  @IsOptional()
  cnpjMandElet?: string;

  @IsInt()
  @IsOptional()
  origRetif?: number;

  @IsInt()
  @IsOptional()
  tpProc?: number;

  @IsInt()
  @IsOptional()
  nrProc?: number;

  @IsInt()
  employeeId: number;

  @IsInt()
  @IsOptional()
  motiveId?: number;

  @IsInt()
  @IsOptional()
  esocial18Motive?: number;

  @IsString()
  @IsOptional()
  cidId?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `Status inválido`,
  })
  status?: StatusEnum;
}

export class UpdateAbsenteeismDto extends CreateAbsenteeismDto {
  @IsInt()
  id: number;
}

export class FindAbsenteeismDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companiesIds?: string[];

  @IsOptional()
  @Transform(QueryIntArray, { toClassOnly: true })
  @IsInt({ each: true })
  employeeIds?: number[];

  @IsOptional()
  @Transform(QueryIntArray, { toClassOnly: true })
  @IsInt({ each: true })
  motiveIds?: number[];

  @IsOptional()
  @IsDateString()
  absenteeismOverlapStart?: string;

  @IsOptional()
  @IsDateString()
  absenteeismOverlapEnd?: string;

  @IsOptional()
  @IsEnum(AbsenteeismListSortByEnum)
  listSortBy?: AbsenteeismListSortByEnum;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
  @IsIn(['asc', 'desc'])
  listSortOrder?: 'asc' | 'desc';
}
