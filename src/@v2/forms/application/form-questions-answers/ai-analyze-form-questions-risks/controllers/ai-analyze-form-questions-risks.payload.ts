import { IsString, IsOptional } from 'class-validator';

export class AiAnalyzeFormQuestionsRisksPayload {
  @IsString()
  @IsOptional()
  customPrompt?: string;

  @IsString()
  @IsOptional()
  model?: string; // Optional AI model to use (e.g., 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo')
}
