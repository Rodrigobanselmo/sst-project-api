import { IsString } from 'class-validator';

export class BrowseFormQuestionsAnswersRisksPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
