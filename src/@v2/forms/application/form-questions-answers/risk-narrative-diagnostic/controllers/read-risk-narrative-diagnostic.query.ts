import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

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

export class ReadRiskNarrativeDiagnosticQuery {
  @IsOptional()
  @IsString()
  groupingQuestionId?: string;

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsString({ each: true })
  participantGroupIds?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsString({ each: true })
  allowedHierarchyIds?: string[];

  @IsOptional()
  @IsString()
  groupingLabel?: string;
}
