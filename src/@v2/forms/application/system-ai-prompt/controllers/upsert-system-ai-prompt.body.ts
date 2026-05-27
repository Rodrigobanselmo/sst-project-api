import { IsString, MinLength } from 'class-validator';

export class UpsertSystemAiPromptBody {
  @IsString()
  @MinLength(1)
  content!: string;
}
