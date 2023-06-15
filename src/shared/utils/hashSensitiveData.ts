import { HashProvider } from "../providers/HashProvider/implementations/HashProvider";

export const hashSensitiveData = (data: any) => {
  if (data.password) data.password = ''

  return data
};
