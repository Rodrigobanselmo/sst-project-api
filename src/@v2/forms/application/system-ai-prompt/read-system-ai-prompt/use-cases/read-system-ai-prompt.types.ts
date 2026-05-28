import { SystemAiPromptKeyEnum } from '../../constants/system-ai-prompt-key.enum';

export namespace IReadSystemAiPromptUseCase {
  export type Params = {
    key: SystemAiPromptKeyEnum;
  };

  export type Result = {
    key: SystemAiPromptKeyEnum;
    content: string;
    revision: number;
    updatedBy: number | null;
    updatedAt: string;
    isPersistedDefault: boolean;
  };
}
