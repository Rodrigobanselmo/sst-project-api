import { IsString } from 'class-validator';

export class AiAnalyzeFormQuestionsRisksPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
