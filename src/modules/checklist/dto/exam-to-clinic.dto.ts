import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

import { DateFormat } from './../../../shared/transformers/date-format';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';

export class UpsertExamToClinicDto {
  @IsInt()
  examId: number;

  @IsString()
  companyId: string;

  @IsOptional()
  @IsInt()
  dueInDays?: number;

  @IsBoolean()
  @IsOptional()
  isScheduled?: boolean;

  @IsString()
  @IsOptional()
  observation: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `Tipo de status inválido`,
  })
  status?: StatusEnum;
}

export class CreateExamToClinicPricingDto {
  @IsInt()
  @IsOptional()
  examToClinicId: number;

  @IsInt()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  observation: string;

  @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;
}

export class CreateExamToClinicScheduleDto {
  @IsInt()
  @IsOptional()
  examToClinicId: number;

  @IsInt()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsString()
  @IsOptional()
  endTime: string;

  @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}

export class FindExamToClinicDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
