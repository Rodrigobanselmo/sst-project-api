import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

export class UpsertRiskDocInfoDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  companyId: string;

  @IsString()
  riskId: string;

  @IsOptional()
  @IsString()
  hierarchyId?: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isAso?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPGR?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPCMSO?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPPP?: boolean;
}
