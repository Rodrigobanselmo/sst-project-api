import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpsertRiskSubTypeAiInstructionBody {
  @Type(() => Boolean)
  @IsBoolean()
  useSystemDefault!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  instructions?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  positiveExamples?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  negativeExamples?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  cautionRules?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  preferredModel?: string | null;
}

export class PreviewRiskSubtypeCurationAiPromptBody {
  @Type(() => Number)
  @IsInt()
  subTypeId!: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  useSystemDefault?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  instructions?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  positiveExamples?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  negativeExamples?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  cautionRules?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  preferredModel?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  customPrompt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  model?: string;
}
