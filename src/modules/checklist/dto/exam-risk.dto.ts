import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { DateFormat } from './../../../shared/transformers/date-format';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class CreateExamsRiskDto {
  @IsInt()
  examId: number;

  @IsString()
  riskId: string;

  @IsString()
  companyId: string;

  @IsBoolean()
  @IsOptional()
  isMale?: boolean;

  @IsBoolean()
  @IsOptional()
  isFemale: boolean;

  @IsBoolean()
  @IsOptional()
  isPeriodic: boolean;

  @IsBoolean()
  @IsOptional()
  isChange: boolean;

  @IsBoolean()
  @IsOptional()
  isAdmission: boolean;

  @IsBoolean()
  @IsOptional()
  isReturn: boolean;

  @IsBoolean()
  @IsOptional()
  isDismissal: boolean;

  @IsInt()
  @IsOptional()
  validityInMonths: number;

  @IsInt()
  @IsOptional()
  lowValidityInMonths: number;

  @IsInt()
  @IsOptional()
  fromAge: number;

  @IsInt()
  @IsOptional()
  toAge: number;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de fim inválida' })
  @Type(() => Date)
  endDate: Date;
}

export class UpdateExamRiskDto extends PartialType(CreateExamsRiskDto) {
  @IsInt()
  @IsOptional()
  id?: number;
}

export class FindExamRiskDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
