import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { DateFormat } from './../../../shared/transformers/date-format';
import { PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { Transform, Type } from 'class-transformer';
import {
  ExamHistoryConclusionEnum,
  ExamHistoryEvaluationEnum,
  ExamHistoryTypeEnum,
  StatusEnum,
} from '@prisma/client';

export class EmployeeComplementaryExamHistoryDto {
  @IsInt()
  examId: number;

  @IsInt()
  validityInMonths: number;

  @IsInt()
  clinicId: string;

  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de realização de exame inválida' })
  @Type(() => Date)
  doneDate: Date;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status inválido`,
  })
  status: StatusEnum;
}
export class CreateEmployeeExamHistoryDto {
  @IsInt()
  examId: number;

  @IsInt()
  employeeId: number;

  @IsString()
  time: string;

  @IsString()
  @IsOptional()
  obs: string;

  @IsInt()
  validityInMonths: number;

  @IsInt()
  doctorId: number;

  @IsInt()
  clinicId: string;

  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de realização de exame inválida' })
  @Type(() => Date)
  doneDate: Date;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(ExamHistoryTypeEnum, {
    message: `tipo de exame inválido`,
  })
  examType: ExamHistoryTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(ExamHistoryEvaluationEnum, {
    message: `tipo de avaliação inválido`,
  })
  evaluationType: ExamHistoryEvaluationEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(ExamHistoryConclusionEnum, {
    message: `tipo de conclusão inválido`,
  })
  conclusion: ExamHistoryConclusionEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status inválido`,
  })
  status: StatusEnum;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => EmployeeComplementaryExamHistoryDto)
  examsData?: EmployeeComplementaryExamHistoryDto[];
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
