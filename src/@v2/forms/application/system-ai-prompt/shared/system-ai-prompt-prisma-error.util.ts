export const isSystemAiPromptEnumUnavailableError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);

  return /invalid input value for enum|SystemAiPromptKeyEnum|enum "SystemAiPromptKeyEnum"/i.test(
    message,
  );
};
