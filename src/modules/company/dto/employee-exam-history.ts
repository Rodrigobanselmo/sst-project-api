import { DateFormat } from './../../../shared/transformers/date-format';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { Transform, Type } from 'class-transformer';

export class CreateEmployeeExamHistoryDto {
  @IsInt()
  @IsOptional()
  examId: number;

  @IsInt()
  @IsOptional()
  employeeId: number;

  @IsString()
  @IsOptional()
  time: string;

  @IsInt()
  @IsOptional()
  validityInMonths: number;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de realização de exame inválida' })
  @Type(() => Date)
  doneDate: Date;
}

export class UpdateEmployeeExamHistoryDto extends PartialType(
  CreateEmployeeExamHistoryDto,
) {
  @IsInt()
  @IsOptional()
  id: number;
}

export class FindEmployeeExamHistoryDto extends PaginationQueryDto {
  @IsString()
  companyId?: string;

  @IsString()
  @IsOptional()
  examId?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;
}
