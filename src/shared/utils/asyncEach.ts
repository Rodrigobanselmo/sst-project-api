export const asyncEach = async <T>(
  arr: T[],
  callbackFn: (value: T, index?: number) => Promise<any>,
): Promise<any> => {
  for (const value of arr) await callbackFn(value);
};
