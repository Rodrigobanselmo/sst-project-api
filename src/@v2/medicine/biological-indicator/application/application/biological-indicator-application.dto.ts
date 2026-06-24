import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

function parseIndicatorIds(value: unknown): string[] | undefined {
  if (value == null || value === '') return undefined;
  if (Array.isArray(value)) return value.map(String);
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export class BiologicalIndicatorApplicationPreviewQuery {
  @IsOptional()
  @Transform(({ value }) => parseIndicatorIds(value))
  @IsArray()
  @IsString({ each: true })
  indicatorIds?: string[];
}

export class ApplyBiologicalIndicatorsBody {
  @IsBoolean()
  confirmApply!: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  indicatorIds?: string[];
}
