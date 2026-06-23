import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ClearFormAiAnalysisScopeEnum } from '@/@v2/forms/application/form-questions-answers/clear-form-questions-answers-analysis/use-cases/clear-form-questions-answers-analysis.types';

export class RecoverStuckFormQuestionsAnswersAnalysisPayload {
  @IsEnum(ClearFormAiAnalysisScopeEnum)
  scope!: ClearFormAiAnalysisScopeEnum;

  @IsBoolean()
  @IsOptional()
  dryRun?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  olderThanMinutes?: number;

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
