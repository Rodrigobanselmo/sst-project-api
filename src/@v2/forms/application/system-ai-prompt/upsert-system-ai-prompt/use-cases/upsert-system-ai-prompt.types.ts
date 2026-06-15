import { SystemAiPromptKeyEnum } from '../../constants/system-ai-prompt-key.enum';

export namespace IUpsertSystemAiPromptUseCase {
  export type Params = {
    key: SystemAiPromptKeyEnum;
    content: string;
  };

  export type Result = {
    key: SystemAiPromptKeyEnum;
    content: string;
    defaultContent: string;
    revision: number;
    updatedBy: number | null;
    updatedAt: string;
    isPersistedDefault: boolean;
  };
}
