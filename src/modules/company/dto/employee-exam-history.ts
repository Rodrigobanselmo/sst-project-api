import { StringCapitalizeTransform } from './../../../shared/transformers/string-capitalize';
import { ErrorCompanyEnum } from './../../../shared/constants/enum/errorMessage';
import { CpfFormatTransform } from './../../../shared/transformers/cpf-format.transform';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { DateFormat } from './../../../shared/transformers/date-format';
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
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

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
import { PartialType } from '@nestjs/swagger';

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
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  scheduleMedicalVisitId?: number;

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
  @ToBoolean()
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

export class UpdateEmployeeExamHistoryDto extends PartialType(CreateEmployeeExamHistoryDto) {
  @IsInt()
  @IsOptional()
  id: number;

  @IsInt()
  @IsOptional()
  doctorId?: number;

  @IsInt()
  @IsOptional()
  userDoneId?: number;

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
  @ToBoolean()
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

export class QueryFiltersEmployeeExamHistory extends PaginationQueryDto {
  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  status?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  notInStatus?: string[];

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
  clinicsIds?: string[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  @IsEnum(ExamHistoryTypeEnum, {
    message: `Typo de exame inválida`,
    each: true,
  })
  notInExamType?: ExamHistoryTypeEnum[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  @IsEnum(ExamHistoryEvaluationEnum, {
    message: `Typo de avaliação inválida`,
    each: true,
  })
  notInEvaluationType?: ExamHistoryEvaluationEnum[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  notInAvaliationType?: string[];
}

export class FindEmployeeExamHistoryDto extends QueryFiltersEmployeeExamHistory {
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
  @ToBoolean()
  @IsOptional()
  allCompanies?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  allExams?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  orderByCreation?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  includeClinic?: boolean;
}

export class FindClinicEmployeeExamHistoryDto {
  @IsString()
  companyId?: string;

  @IsString()
  @IsOptional()
  employeeCompanyId?: string;

  @IsOptional()
  @IsString()
  hierarchyId?: string;

  @IsOptional()
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(ExamHistoryTypeEnum, {
    message: `tipo de exame inválido`,
  })
  examType?: ExamHistoryTypeEnum;

  @IsOptional()
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(StatusEnum, {
    message: `tipo de status inválido`,
  })
  status?: StatusEnum;

  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  examIsAvaliation?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  getClinic?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  getUser?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  getHierarchy?: boolean;

  @ValidateIf((o) => !o.employeeId)
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  notAfterDate: Date;
}

export class FindCompanyEmployeeExamHistoryDto extends QueryFiltersEmployeeExamHistory {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  companyId?: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  allCompanies?: boolean;

  // @Transform(DateFormat, { toClassOnly: true })
  // @IsDate({ message: 'Data inválida' })
  // @Type(() => Date)
  // date: Date;
}

export class FindClinicScheduleTimeDto {
  @IsString()
  clinicId: string;

  @IsInt()
  examId: number;

  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  date: Date;
}
