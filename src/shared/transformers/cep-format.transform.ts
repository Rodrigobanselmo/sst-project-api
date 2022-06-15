import { onlyNumbers } from '@brazilian-utils/brazilian-utils';
import { TransformFnParams } from 'class-transformer';

export const CepFormatTransform = (data: TransformFnParams) => {
  const cep = String(data.obj[data.key]);

  if (typeof cep === 'string') {
    const onlyNumbersCep = onlyNumbers(cep);

    if (onlyNumbersCep.length === 8) {
      return onlyNumbersCep;
    }
  }

  return null;
};
