/* eslint-disable @typescript-eslint/no-explicit-any */

interface IDuplicateOptions {
  simpleCompare?: boolean;
  removeById?: string;
}

export function removeDuplicate<T>(array: T[], options?: IDuplicateOptions) {
  if (options?.simpleCompare) return array.filter((item, index, self) => index === self.findIndex((t) => t == item));

  if (options?.removeById)
    return array.filter((item, index, self) => index === self.findIndex((t) => t[options.removeById as string] == item[options.removeById as string]));

  return array;
}
