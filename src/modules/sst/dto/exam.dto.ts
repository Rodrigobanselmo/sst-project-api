import { QueryArray } from '../../../shared/transformers/query-array';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { PartialType } from '@nestjs/swagger';
import { ExamTypeEnum, StatusEnum, HomogeneousGroup } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class CreateExamDto {
  @IsString()
  name: string;

  @IsString()
  companyId: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  analyses?: string;

  @IsOptional()
  @IsString()
  instruction?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  esocial27Code?: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isAttendance?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isAvaliation?: boolean;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ExamTypeEnum, {
    message: `Tipo de exame inválidp`,
  })
  type?: ExamTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  // @IsOptional()
  // @IsString({ each: true })
  // riskIds: string[];
}

export class UpdateExamDto extends PartialType(CreateExamDto) {}

export class CheckEmployeeExamDto {
  homogeneousGroupId?: string;
  homogeneousGroupIds?: string[];

  hierarchyId?: string;

  employeeId?: number;

  companyId?: string;
  riskId?: string;
  riskIds?: string[];
}

export class UpsertExamDto extends CreateExamDto {
  @IsInt()
  @IsOptional()
  id: number;
}

export class FindExamDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isAttendance?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isAvaliation?: boolean;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
    each: true,
  })
  status?: StatusEnum;
}

export class FindExamHierarchyDto {
  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  subOfficesIds?: string[];

  @IsString()
  @IsOptional()
  hierarchyId?: string;

  @IsInt()
  @IsOptional()
  employeeId?: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isPendingExams?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  onlyAttendance?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  skipNewExams?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isOffice?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  getAllExamToRiskWithoutHierarchy?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isPeriodic?: boolean;
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isChange?: boolean;
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isAdmission?: boolean;
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isReturn?: boolean;
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isDismissal?: boolean;
}
