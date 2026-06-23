import { IsString } from 'class-validator';

export class RecoverStuckFormQuestionsAnswersAnalysisPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
