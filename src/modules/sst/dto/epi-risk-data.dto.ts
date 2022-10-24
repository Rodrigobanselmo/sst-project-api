import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class EpiRoRiskDataDto {
  @IsInt()
  @IsOptional()
  epiId?: number;

  @IsString()
  @IsOptional()
  riskFactorDataId?: string;

  @IsOptional()
  @IsInt()
  lifeTimeInDays?: number;

  @IsBoolean()
  @IsOptional()
  efficientlyCheck?: boolean;

  @IsBoolean()
  @IsOptional()
  epcCheck?: boolean;

  @IsBoolean()
  @IsOptional()
  longPeriodsCheck?: boolean;

  @IsBoolean()
  @IsOptional()
  validationCheck?: boolean;

  @IsBoolean()
  @IsOptional()
  tradeSignCheck?: boolean;

  @IsBoolean()
  @IsOptional()
  sanitationCheck?: boolean;

  @IsBoolean()
  @IsOptional()
  maintenanceCheck?: boolean;

  @IsBoolean()
  @IsOptional()
  unstoppedCheck?: boolean;

  @IsBoolean()
  @IsOptional()
  trainingCheck?: boolean;
}
