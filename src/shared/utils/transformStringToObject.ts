export const transformStringToObject = (
  string: string,
  value: any,
  index = 0,
) => {
  const arraySplitted = string.split('.');

  if (arraySplitted.length === index + 1)
    return { [arraySplitted[index]]: value };

  return {
    [arraySplitted[index]]: transformStringToObject(string, value, index + 1),
  };
};
