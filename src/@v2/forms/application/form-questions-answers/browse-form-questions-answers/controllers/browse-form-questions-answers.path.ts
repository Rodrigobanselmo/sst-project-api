import { IsString } from 'class-validator';

export class BrowseFormQuestionsAnswersPath {
  @IsString()
  companyId!: string;
}
