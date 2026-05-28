import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { parseShowOnlyGroupIndicators } from '../shared/indicators-narrative-diagnostic-scope.types';

const toStringArray = (value: unknown): string[] | undefined => {
  if (value == null || value === '') return undefined;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return undefined;
};

export class ReadIndicatorsNarrativeDiagnosticQuery {
  /** Quando informado, busca exatamente este registro (mesma chave usada no POST). */
  @IsOptional()
  @IsString()
  scopeKey?: string;

  @IsOptional()
  @IsString()
  groupingQuestionId?: string;

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsString({ each: true })
  participantGroupIds?: string[];

  @IsOptional()
  @IsString()
  groupingLabel?: string;

  @IsOptional()
  @Transform(({ value }) => parseShowOnlyGroupIndicators(value))
  @IsBoolean()
  showOnlyGroupIndicators?: boolean;
}
