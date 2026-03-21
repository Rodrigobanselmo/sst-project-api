import type { StructuredToolInterface } from '@langchain/core/tools';

/**
 * Provides helpful suggestions based on the error and tool name
 */
function getErrorSuggestion(toolName: string, errorMessage: string): string {
  if (errorMessage.includes('duplicate key') || errorMessage.includes('23505')) {
    return 'This item already exists. Try searching for it instead of creating.';
  }

  if (errorMessage.includes('not found') || errorMessage.includes('NotFound')) {
    return 'The requested item was not found. Make sure the ID is correct or list available items first.';
  }

  if (errorMessage.includes('permission') || errorMessage.includes('forbidden') || errorMessage.includes('unauthorized')) {
    return 'Permission denied. The user may not have access to this resource.';
  }

  if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
    return 'The request timed out. Try again or use a simpler query.';
  }

  return 'Check the input parameters and try again, or use a different approach.';
}

/**
 * Wraps a tool with global error handling so the AI can always recover from errors.
 * Instead of throwing, it returns a JSON error message that the AI can interpret.
 */
export function withErrorHandling<T extends StructuredToolInterface>(wrappedTool: T): T {
  const originalInvoke = wrappedTool.invoke.bind(wrappedTool);

  wrappedTool.invoke = async (input: Parameters<T['invoke']>[0], config?: Parameters<T['invoke']>[1]) => {
    try {
      return await originalInvoke(input, config);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Tool Error] ${wrappedTool.name}: ${errorMessage}`);

      return JSON.stringify(
        {
          error: true,
          toolName: wrappedTool.name,
          message: errorMessage,
          suggestion: getErrorSuggestion(wrappedTool.name, errorMessage),
        },
        null,
        2,
      );
    }
  };

  return wrappedTool;
}
