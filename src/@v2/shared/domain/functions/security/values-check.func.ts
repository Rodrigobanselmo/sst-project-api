interface IValuesCheckParams {
  value?: string, limits: number[], highValue?: number
}

export function valuesCheck({ highValue, limits, value }: IValuesCheckParams) {
  if (!value || !limits.length) return 0;
  value = String(value).replace(/[^0-9.]/g, '');

  let returnValue = 0;

  for (let index = 0; index < limits.length; index++) {
    const actualValue = Number(value);
    if (actualValue < limits[index]) {
      returnValue = index + 1;
      break;
    }
  }

  return highValue && returnValue > highValue ? highValue : returnValue;
}