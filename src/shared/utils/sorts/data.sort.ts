// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortData = function (a: any, b: any, field?: string) {
  const arrayA = field ? a[field] : a;
  const arrayB = field ? b[field] : b;

  if (new Date(arrayA) > new Date(arrayB)) {
    return 1;
  }
  if (new Date(arrayB) > new Date(arrayA)) {
    return -1;
  }
  return 0;
};
