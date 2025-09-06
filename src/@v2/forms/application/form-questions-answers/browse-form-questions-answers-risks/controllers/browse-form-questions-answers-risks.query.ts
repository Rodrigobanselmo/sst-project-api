import { IsString } from 'class-validator';

export class BrowseFormQuestionsAnswersRisksQuery {
  @IsString()
  formApplicationId!: string;
}
