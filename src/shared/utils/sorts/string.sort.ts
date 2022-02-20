// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortString = function (a: any, b: any, field?: string) {
  const arrayA = field ? a[field] : a;
  const arrayB = field ? b[field] : b;

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
