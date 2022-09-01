import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { DateFormat } from './../../../shared/transformers/date-format';
import { PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
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

  @IsString()
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
  @ValidateIf((o) => !!o.examId)
  @IsInt()
  examId: number;

  @ValidateIf((o) => !!o.examId)
  @IsInt()
  employeeId: number;

  @ValidateIf((o) => !!o.examId)
  @IsString()
  time: string;

  @IsString()
  @IsOptional()
  obs: string;

  @ValidateIf((o) => !!o.examId)
  @IsInt()
  validityInMonths: number;

  @ValidateIf((o) => !!o.examId)
  @IsInt()
  doctorId: number;

  @ValidateIf((o) => !!o.examId)
  @IsString()
  clinicId: string;

  @ValidateIf((o) => !!o.examId)
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de realização de exame inválida' })
  @Type(() => Date)
  doneDate: Date;

  @ValidateIf((o) => !!o.examId)
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(ExamHistoryTypeEnum, {
    message: `tipo de exame inválido`,
  })
  examType: ExamHistoryTypeEnum;

  @ValidateIf((o) => !!o.examId)
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(ExamHistoryEvaluationEnum, {
    message: `tipo de avaliação inválido`,
  })
  evaluationType: ExamHistoryEvaluationEnum;

  @ValidateIf((o) => !!o.examId)
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

  @IsInt()
  @IsOptional()
  doctorId: number;

  @IsString()
  @IsOptional()
  time: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ExamHistoryEvaluationEnum, {
    message: `tipo de avaliação inválido`,
  })
  evaluationType: ExamHistoryEvaluationEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ExamHistoryConclusionEnum, {
    message: `tipo de conclusão inválido`,
  })
  conclusion: ExamHistoryConclusionEnum;
}

export class FindEmployeeExamHistoryDto extends PaginationQueryDto {
  @IsString()
  companyId?: string;

  @IsInt()
  @IsOptional()
  examId?: number;

  @IsInt()
  @IsOptional()
  employeeId?: number;
}
