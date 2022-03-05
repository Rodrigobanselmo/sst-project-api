/* eslint-disable @typescript-eslint/no-unused-vars */
export const checkIsEnum = (value: any, enums: any) => {
  const transformToNumber = String(value);

  if (!transformToNumber) {
    return false;
  }

  if (typeof value === 'string') {
    if (Object.values(enums).includes(value)) {
      return value;
    }
  }

  return false;
};
