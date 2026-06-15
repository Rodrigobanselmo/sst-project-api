import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { parseShowOnlyGroupIndicators } from '@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/shared/indicators-narrative-diagnostic-scope.types';

class ConsolidatedIndicatorsNarrativeScopeBody {
  @IsOptional()
  @IsString()
  groupingMode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participantGroupIds?: string[];

  @IsOptional()
  @IsString()
  groupingLabel?: string | null;

  @Transform(({ value }) => parseShowOnlyGroupIndicators(value))
  @IsBoolean()
  showOnlyGroupIndicators!: boolean;
}

export class CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticBody {
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
  @Type(() => ConsolidatedIndicatorsNarrativeScopeBody)
  scope!: ConsolidatedIndicatorsNarrativeScopeBody;

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
