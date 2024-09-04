// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortNumber = function <T = any>(a: T, b: T, field?: string) {
  if (a == undefined || b == undefined) return 0;

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
