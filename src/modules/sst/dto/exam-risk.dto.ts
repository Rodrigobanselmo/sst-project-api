import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { DateFormat } from '../../../shared/transformers/date-format';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

export class CreateExamsRiskDto {
  @IsInt()
  examId: number;

  @IsString()
  riskId: string;

  @IsString()
  companyId: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isMale?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isFemale: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isPeriodic: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isChange: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isAdmission: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isReturn: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isDismissal: boolean;

  @ValidateIf((o) => o.validityInMonths !== null)
  @IsInt()
  @IsOptional()
  validityInMonths: number;

  @ValidateIf((o) => o.lowValidityInMonths !== null)
  @IsInt()
  @IsOptional()
  lowValidityInMonths: number;

  @ValidateIf((o) => o.considerBetweenDays !== null)
  @IsInt()
  @IsOptional()
  considerBetweenDays: number;

  @ValidateIf((o) => o.fromAge !== null)
  @IsInt()
  @IsOptional()
  fromAge: number;

  @IsInt()
  @IsOptional()
  toAge: number;

  @IsInt()
  @IsOptional()
  minRiskDegree: number;

  @IsInt()
  @IsOptional()
  minRiskDegreeQuantity: number;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startDate: Date;
}

export class UpdateExamRiskDto extends PartialType(CreateExamsRiskDto) {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsString()
  realCompanyId?: string;

  @IsOptional()
  @IsString()
  addSkipCompanyId?: string;
}

export class CopyExamsRiskDto {
  @IsString()
  fromCompanyId: string;

  @IsString()
  companyId: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  overwrite?: boolean;
}

export class UpsertManyExamsRiskDto {
  data: UpdateExamRiskDto[];
  companyId: string;
}

/**
 * Campos do vínculo Exame × Risco que podem ser alterados em lote (Fase 2).
 * Todos opcionais: somente os campos enviados são aplicados aos vínculos
 * selecionados. Não inclui examId/riskId — o lote não troca exame nem risco.
 * Campos numéricos aceitam null para "limpar" (ex.: faixa etária).
 */
export class BulkPatchExamRiskDto {
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isMale?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isFemale?: boolean;

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

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  validityInMonths?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  considerBetweenDays?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  fromAge?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  toAge?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  minRiskDegree?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  minRiskDegreeQuantity?: number | null;
}

export class BulkUpdateExamRiskDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];

  @ValidateNested()
  @Type(() => BulkPatchExamRiskDto)
  patch: BulkPatchExamRiskDto;

  @IsOptional()
  @IsString()
  companyId?: string;
}

export class BulkDeleteExamRiskDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];

  @IsOptional()
  @IsString()
  companyId?: string;
}

export enum FindExamRiskOrderByEnum {
  RISK = 'risk',
  EXAM = 'exam',
  VALIDITY = 'validity',
}

export class FindExamRiskDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string | string[];

  @IsString()
  @IsOptional()
  targetCompanyId?: string;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsOptional()
  @IsEnum(FindExamRiskOrderByEnum)
  orderBy?: FindExamRiskOrderByEnum;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderByDirection?: 'asc' | 'desc';
}
