import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { ClinicScheduleTypeEnum, Prisma, StatusEnum } from '@prisma/client';
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

  @IsInt()
  @IsOptional()
  price: number;

  @IsOptional()
  scheduleRange?: Prisma.JsonValue;

  @IsInt()
  @IsOptional()
  examMinDuration: number;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ClinicScheduleTypeEnum, {
    message: `Tipo de agendamento inválido`,
  })
  scheduleType: ClinicScheduleTypeEnum;

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
