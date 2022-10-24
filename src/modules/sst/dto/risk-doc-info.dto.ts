import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

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
  isAso?: boolean;

  @IsOptional()
  @IsBoolean()
  isPGR?: boolean;

  @IsOptional()
  @IsBoolean()
  isPCMSO?: boolean;

  @IsOptional()
  @IsBoolean()
  isPPP?: boolean;
}
