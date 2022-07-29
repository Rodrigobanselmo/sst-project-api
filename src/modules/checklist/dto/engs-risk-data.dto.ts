import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class EngsRiskDataDto {
  @IsString()
  @IsOptional()
  recMedId?: string;

  @IsString()
  @IsOptional()
  riskFactorDataId?: string;

  @IsBoolean()
  @IsOptional()
  efficientlyCheck?: boolean;
}
