/**
 * Parses query/body values into boolean | undefined.
 * Avoids Boolean("false") === true when using implicit conversion.
 */
export function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (value === true || value === 'true') {
    return true;
  }
  if (value === false || value === 'false') {
    return false;
  }
  return undefined;
}
