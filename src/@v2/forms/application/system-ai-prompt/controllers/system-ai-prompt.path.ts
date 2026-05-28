import { IsEnum } from 'class-validator';
import { SystemAiPromptKeyEnum } from '../constants/system-ai-prompt-key.enum';

export class SystemAiPromptPath {
  @IsEnum(SystemAiPromptKeyEnum)
  key!: SystemAiPromptKeyEnum;
}
