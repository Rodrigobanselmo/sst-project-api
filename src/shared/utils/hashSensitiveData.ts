import { HashProvider } from "../providers/HashProvider/implementations/HashProvider";

export const hashSensitiveData = (data: any, hashProvider: HashProvider) => {
  if (data.password) data.password = hashProvider.createHash(data.password);

  return data
};
