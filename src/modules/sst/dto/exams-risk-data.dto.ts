import { IsBoolean, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

export class ExamsRiskDataDto {
  @IsInt()
  @IsOptional()
  examId?: number;

  @IsString()
  @IsOptional()
  riskFactorDataId?: string;

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

  @ValidateIf((o) => o.toAge !== null)
  @IsInt()
  @IsOptional()
  toAge: number;
}
