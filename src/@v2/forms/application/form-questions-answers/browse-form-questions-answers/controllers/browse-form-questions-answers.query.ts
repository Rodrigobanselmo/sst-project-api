import { IsOptional, IsString } from 'class-validator';

export class BrowseFormQuestionsAnswersQuery {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  formApplicationId!: string;
}
