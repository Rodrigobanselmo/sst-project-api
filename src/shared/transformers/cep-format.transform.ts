import { TransformFnParams } from 'class-transformer';

export const CepFormatTransform = (data: TransformFnParams) => {
  const cep = String(data.obj[data.key]);

  if (typeof cep === 'string') {
    const onlyNumbersCep = cep.replace(/\D+/g, '');

    if (onlyNumbersCep.length === 8) {
      return onlyNumbersCep;
    }
  }

  return null;
};
