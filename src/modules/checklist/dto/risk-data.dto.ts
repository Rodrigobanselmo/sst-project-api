import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpsertRiskDataDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsNumber()
  probability?: number;

  @IsOptional()
  @IsNumber()
  probabilityAfter?: number;

  @IsString()
  companyId: string;

  @IsString()
  riskId: string;

  @ValidateIf((o) => !o.homogeneousGroupId || o.hierarchyId)
  @IsString()
  hierarchyId: string;

  @ValidateIf((o) => !o.hierarchyId || o.homogeneousGroupId)
  @IsString()
  homogeneousGroupId: string;

  @IsString()
  riskFactorGroupDataId: string;

  @IsString({ each: true })
  @IsOptional()
  recs?: string[];

  @IsString({ each: true })
  @IsOptional()
  engs?: string[];

  @IsString({ each: true })
  @IsOptional()
  adms?: string[];

  @IsOptional()
  @IsString({ each: true })
  generateSources?: string[];

  @IsInt({ each: true })
  @IsOptional()
  epis?: number[];
}
