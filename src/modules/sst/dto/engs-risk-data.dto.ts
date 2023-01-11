import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

export class EngsRiskDataDto {
  @IsString()
  @IsOptional()
  recMedId?: string;

  @IsString()
  @IsOptional()
  riskFactorDataId?: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  efficientlyCheck?: boolean;
}
