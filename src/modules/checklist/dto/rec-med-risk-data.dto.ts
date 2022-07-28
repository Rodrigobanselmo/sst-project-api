import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class RecMedRiskDataDto {
  @IsInt()
  @IsOptional()
  recMedId?: number;

  @IsString()
  @IsOptional()
  riskFactorDataId?: string;

  @IsBoolean()
  @IsOptional()
  efficientlyCheck?: boolean;
}
