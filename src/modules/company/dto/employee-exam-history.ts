import { StringCapitalizeTransform } from './../../../shared/transformers/string-capitalize';
import { ErrorCompanyEnum } from './../../../shared/constants/enum/errorMessage';
import { CpfFormatTransform } from './../../../shared/transformers/cpf-format.transform';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { DateFormat } from './../../../shared/transformers/date-format';
import { PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { Transform, Type } from 'class-transformer';
import {
  ClinicScheduleTypeEnum,
  ExamHistoryConclusionEnum,
  ExamHistoryEvaluationEnum,
  ExamHistoryTypeEnum,
  SexTypeEnum,
  StatusEnum,
} from '@prisma/client';
import { QueryArray } from './../../../shared/transformers/query-array';

export class EmployeeComplementaryExamHistoryDto {
  @IsInt()
  examId: number;

  @IsInt()
  validityInMonths: number;

  @IsString()
  clinicId: string;

  @IsOptional()
  @IsString()
  time: string;

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

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ClinicScheduleTypeEnum, {
    message: `tipo de conclusão inválido`,
  })
  scheduleType: ClinicScheduleTypeEnum;
}
export class CreateEmployeeExamHistoryDto {
  @ValidateIf((o) => !!o.examId && o.status == StatusEnum.DONE)
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

  @IsString()
  @IsOptional()
  clinicObs: string;

  @ValidateIf((o) => !!o.examId && o.status == StatusEnum.DONE)
  @IsInt()
  validityInMonths: number;

  @ValidateIf((o) => !!o.examId && o.status == StatusEnum.DONE)
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

  @ValidateIf((o) => !!o.examId && o.status == StatusEnum.DONE)
  @Transform(StringUppercaseTransform, { toClassOnly: true })
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

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status inválido`,
  })
  status: StatusEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ClinicScheduleTypeEnum, {
    message: `tipo de conclusão inválido`,
  })
  scheduleType?: ClinicScheduleTypeEnum;

  @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  changeHierarchyDate?: Date;

  @IsOptional()
  @IsBoolean()
  changeHierarchyAnyway?: boolean;

  @IsOptional()
  @IsString()
  hierarchyId?: string;

  @IsOptional()
  @IsString()
  subOfficeId?: string;

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
  doctorId?: number;

  @IsString()
  @IsOptional()
  time?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ExamHistoryEvaluationEnum, {
    message: `tipo de avaliação inválido`,
  })
  evaluationType?: ExamHistoryEvaluationEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ExamHistoryConclusionEnum, {
    message: `tipo de conclusão inválido`,
  })
  conclusion?: ExamHistoryConclusionEnum;
}

export class UpdateManyScheduleExamDto {
  @IsOptional()
  @Transform(CpfFormatTransform, { toClassOnly: true })
  @Length(11, 11, { message: ErrorCompanyEnum.INVALID_CPF })
  cpf: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(SexTypeEnum, {
    message: `Sexo inválido`,
  })
  sex: SexTypeEnum;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de aniversário inválida' })
  @Type(() => Date)
  birthday: Date;

  @IsBoolean()
  @IsOptional()
  isClinic: boolean;

  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => UpdateEmployeeExamHistoryDto)
  data?: UpdateEmployeeExamHistoryDto[];
}

export class UpdateFileExamDto {
  @IsOptional()
  ids: number[];
}

export class FindEmployeeExamHistoryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  companyId?: string;

  @IsInt()
  @IsOptional()
  examId?: number;

  @IsInt()
  @IsOptional()
  employeeId?: number;

  @IsBoolean()
  @IsOptional()
  allCompanies?: boolean;

  @IsBoolean()
  @IsOptional()
  allExams?: boolean;

  @IsBoolean()
  @IsOptional()
  orderByCreation?: boolean;

  @IsBoolean()
  @IsOptional()
  includeClinic?: boolean;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  status?: string[];
}

export class FindClinicEmployeeExamHistoryDto {
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsInt()
  employeeId?: number;

  @ValidateIf((o) => !o.employeeId)
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  date: Date;
}

export class FindCompanyEmployeeExamHistoryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  companyId?: string;

  // @Transform(DateFormat, { toClassOnly: true })
  // @IsDate({ message: 'Data inválida' })
  // @Type(() => Date)
  // date: Date;
}
