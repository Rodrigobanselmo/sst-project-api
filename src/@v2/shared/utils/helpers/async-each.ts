export const asyncEach = async <T, S>(arr: T[], callbackFn: (value: T, index?: number) => Promise<S>): Promise<S[]> => {
  let count = 0;
  const returnCB = [] as (S)[];
  for (const value of arr) {
    const cb = await callbackFn(value, count);
    count++;

    returnCB.push(cb);
  }

  return returnCB;
};
