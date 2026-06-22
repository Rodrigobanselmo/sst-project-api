import { IsString } from 'class-validator';

export class ClearFormQuestionsAnswersAnalysisPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
