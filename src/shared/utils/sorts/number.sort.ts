// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortNumber = function (a: any, b: any, field?: string) {
  const arrayA = field ? a[field] : a;
  const arrayB = field ? b[field] : b;

  if (arrayA > arrayB) {
    return 1;
  }
  if (arrayB > arrayA) {
    return -1;
  }
  return 0;
};
