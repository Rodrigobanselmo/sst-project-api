import { createId } from '@paralleldrive/cuid2';

/**
 * Generates a CUID2 identifier
 * @returns A unique CUID2 string
 */
export const generateCuid = (): string => {
  return createId();
};
