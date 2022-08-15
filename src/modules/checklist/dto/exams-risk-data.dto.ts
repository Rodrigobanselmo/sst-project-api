import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

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

  @IsInt()
  @IsOptional()
  validityInMonths: number;

  @IsInt()
  @IsOptional()
  fromAge: number;

  @IsInt()
  @IsOptional()
  toAge: number;
}
