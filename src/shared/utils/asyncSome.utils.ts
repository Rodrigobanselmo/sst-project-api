export const asyncSome = async <T>(
  arr: T[],
  callbackFn: (value: T, index: number) => Promise<boolean>,
): Promise<boolean> => {
  let index = 0;
  for (const e of arr) {
    if (await callbackFn(e, index)) return true;
    index++;
  }
  return false;
};
