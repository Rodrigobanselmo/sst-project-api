import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

const toOptionalString = ({ value }: { value: unknown }) => {
  if (value == null || value === '') return undefined;
  return typeof value === 'string' ? value : value;
};

export class RiskFactorAiSuggestionLimitsPayload {
  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  nr15lt?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  acgihTwa?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  acgihStel?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  acgihCeiling?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  nioshRel?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  nioshStel?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  nioshCeiling?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  nioshIdlh?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  oshaPel?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  oshaStel?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  oshaCeiling?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  aihaWeel?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  aihaWeelCeiling?: string;
}

export class RiskFactorAiSuggestionKnownDataPayload {
  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  risk?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  severity?: number;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  carcinogenicityAcgih?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  carcinogenicityLinach?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  pv?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  pe?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  observations?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  methodContext?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  pdfObservations?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parseWarnings?: string[];
}

export class RiskFactorAiSuggestionSourceContextPayload {
  @IsEnum(['ho-method-import', 'ho-method-manual', 'risk-factor-form'])
  origin!: 'ho-method-import' | 'ho-method-manual' | 'risk-factor-form';

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  methodInstitution?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  methodCode?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  methodDisplayName?: string;
}

export class RiskFactorAiSuggestionsPayload {
  @IsString()
  type!: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  cas?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  synonyms?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  unit?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  method?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RiskFactorAiSuggestionLimitsPayload)
  limits?: RiskFactorAiSuggestionLimitsPayload;

  @IsOptional()
  @ValidateNested()
  @Type(() => RiskFactorAiSuggestionKnownDataPayload)
  knownData?: RiskFactorAiSuggestionKnownDataPayload;

  @IsOptional()
  @ValidateNested()
  @Type(() => RiskFactorAiSuggestionSourceContextPayload)
  sourceContext?: RiskFactorAiSuggestionSourceContextPayload;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  customPrompt?: string;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString()
  model?: string;
}
