import { IsString, IsUUID } from 'class-validator';

export class BrowseFormQuestionsAnswersAnalysisParams {
  @IsString()
  @IsUUID()
  companyId: string;

  @IsString()
  applicationId: string;
}
