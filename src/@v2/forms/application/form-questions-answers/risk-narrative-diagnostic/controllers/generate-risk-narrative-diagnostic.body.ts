import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class RiskNarrativeDiagnosticScopeBody {
  @IsOptional()
  @IsString()
  groupingQuestionId?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participantGroupIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedHierarchyIds?: string[] | null;

  @IsOptional()
  @IsString()
  groupingLabel?: string | null;
}

export class GenerateRiskNarrativeDiagnosticBody {
  @ValidateNested()
  @Type(() => RiskNarrativeDiagnosticScopeBody)
  scope!: RiskNarrativeDiagnosticScopeBody;

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
