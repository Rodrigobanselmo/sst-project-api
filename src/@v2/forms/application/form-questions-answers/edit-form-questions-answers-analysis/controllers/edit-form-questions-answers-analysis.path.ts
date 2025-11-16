import { IsString } from 'class-validator';

export class EditFormQuestionsAnswersAnalysisPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;

  @IsString()
  analysisId!: string;
}

