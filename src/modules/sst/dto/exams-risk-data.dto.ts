import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ExamsRiskDataDto {
  @IsInt()
  @IsOptional()
  examId?: number;

  @IsString()
  @IsOptional()
  riskFactorDataId?: string;

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
