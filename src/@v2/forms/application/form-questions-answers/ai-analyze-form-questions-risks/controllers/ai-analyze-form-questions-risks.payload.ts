import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AiAnalyzeFormQuestionsRisksModeEnum } from '../use-cases/ai-risk-analysis-merge.helpers';

export class AiAnalyzeFormQuestionsRisksPayload {
  @IsEnum(AiAnalyzeFormQuestionsRisksModeEnum)
  @IsOptional()
  mode?: AiAnalyzeFormQuestionsRisksModeEnum;

  @IsString()
  @IsOptional()
  riskId?: string;

  @IsString()
  @IsOptional()
  hierarchyId?: string;

  @IsString()
  @IsOptional()
  customPrompt?: string;

  @IsString()
  @IsOptional()
  model?: string;
}
