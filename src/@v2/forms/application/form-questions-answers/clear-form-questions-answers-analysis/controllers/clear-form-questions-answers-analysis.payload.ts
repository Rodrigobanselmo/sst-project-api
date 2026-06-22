import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ClearFormAiAnalysisScopeEnum } from '../use-cases/clear-form-questions-answers-analysis.types';

export class ClearFormQuestionsAnswersAnalysisPayload {
  @IsEnum(ClearFormAiAnalysisScopeEnum)
  scope!: ClearFormAiAnalysisScopeEnum;

  @IsBoolean()
  @IsOptional()
  dryRun?: boolean;

  @IsString()
  @IsOptional()
  riskId?: string;

  @IsString()
  @IsOptional()
  hierarchyId?: string;

  @IsString()
  @IsOptional()
  hierarchyGroupId?: string;
}
