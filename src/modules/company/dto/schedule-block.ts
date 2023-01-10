import { PartialType } from '@nestjs/swagger';
import { ScheduleBlockTypeEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { DateFormat } from '../../../shared/transformers/date-format';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class CreateScheduleBlockDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  endDate?: Date;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsBoolean()
  yearRecurrence: boolean;

  @IsOptional()
  @IsBoolean()
  allCompanies: boolean;

  @IsString()
  @IsOptional()
  companyId: string;

  @IsString({ each: true })
  @IsOptional()
  companiesIds: string[];

  @IsString()
  @IsOptional()
  @IsEnum(ScheduleBlockTypeEnum, {
    message: `Tipo inválido`,
  })
  type: ScheduleBlockTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `Status inválido`,
  })
  status: StatusEnum;
}

export class UpdateScheduleBlockDto extends PartialType(CreateScheduleBlockDto) {
  @IsInt()
  id: number;
}

export class FindScheduleBlockDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
