import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ConsolidatedRiskNarrativeFiltersBody {
  @IsOptional()
  @IsString()
  companyId?: string | null;

  @IsOptional()
  @IsString()
  formApplicationId?: string | null;

  @IsOptional()
  @IsString()
  riskLevel?: string | null;

  @IsOptional()
  @IsString()
  status?: string | null;

  @IsOptional()
  @IsString()
  search?: string | null;
}

class ConsolidatedRiskNarrativeScopeBody {
  @IsOptional()
  @IsString()
  groupingMode?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ConsolidatedRiskNarrativeFiltersBody)
  filters?: ConsolidatedRiskNarrativeFiltersBody;
}

export class CompanyGroupConsolidatedViewRiskNarrativeDiagnosticBody {
  @IsOptional()
  @Transform(({ value }) => {
    if (value == null || value === '') return undefined;
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return undefined;
  })
  @IsArray()
  @IsString({ each: true })
  applicationIds?: string[];

  @ValidateNested()
  @Type(() => ConsolidatedRiskNarrativeScopeBody)
  scope!: ConsolidatedRiskNarrativeScopeBody;

  @IsOptional()
  @IsString()
  customPrompt?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsBoolean()
  regenerate?: boolean;
}
