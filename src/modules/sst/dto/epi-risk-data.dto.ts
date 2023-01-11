import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

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
  @ToBoolean()
  @IsOptional()
  efficientlyCheck?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  epcCheck?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  longPeriodsCheck?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  validationCheck?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  tradeSignCheck?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  sanitationCheck?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  maintenanceCheck?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  unstoppedCheck?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  trainingCheck?: boolean;
}
