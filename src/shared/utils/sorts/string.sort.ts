// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortString = function (
  a: any,
  b: any,
  field?: string,
  field2?: string,
) {
  if (!a) return 0;
  if (!b) return 0;

  let arrayA = field ? a[field] : a;
  let arrayB = field ? b[field] : b;

  if (field2) {
    arrayA = arrayA[field2];
    arrayB = arrayB[field2];
  }

  if (
    arrayA
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9s]/g, '') >
    arrayB
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9s]/g, '')
  ) {
    return 1;
  }
  if (
    arrayB
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9s]/g, '') >
    arrayA
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9s]/g, '')
  ) {
    return -1;
  }
  return 0;
};
