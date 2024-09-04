/* eslint-disable @typescript-eslint/no-explicit-any */

interface IDuplicateOptions {
  removeById?: string;
}

export function removeDuplicate<T>(array: T[], options?: IDuplicateOptions) {
  if (typeof array[0] === 'string' || typeof array[0] === 'number') return array.filter((item, index, self) => index === self.findIndex((t) => t == item));

  if (options?.removeById)
    return array.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[options.removeById as string] == item[options.removeById as string]),
    );

  return array;
}
