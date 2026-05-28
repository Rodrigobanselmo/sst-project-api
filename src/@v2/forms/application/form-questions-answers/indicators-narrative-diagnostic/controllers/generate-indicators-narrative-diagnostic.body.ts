import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { parseShowOnlyGroupIndicators } from '../shared/indicators-narrative-diagnostic-scope.types';

class IndicatorsNarrativeDiagnosticScopeBody {
  @IsOptional()
  @IsString()
  groupingQuestionId?: string | null;

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

export class GenerateIndicatorsNarrativeDiagnosticBody {
  @ValidateNested()
  @Type(() => IndicatorsNarrativeDiagnosticScopeBody)
  scope!: IndicatorsNarrativeDiagnosticScopeBody;

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
