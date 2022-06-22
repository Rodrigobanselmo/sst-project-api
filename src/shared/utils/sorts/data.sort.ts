// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortData = function <T>(a: T, b: T, field?: keyof T) {
  const arrayA = field ? a[field] : a;
  const arrayB = field ? b[field] : b;

  if (arrayA instanceof Date && arrayB instanceof Date) {
    if (new Date(arrayA) > new Date(arrayB)) {
      return 1;
    }
    if (new Date(arrayB) > new Date(arrayA)) {
      return -1;
    }
  }
  return 0;
};
