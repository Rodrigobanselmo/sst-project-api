import { isValidCNPJ, onlyNumbers } from '@brazilian-utils/brazilian-utils';
import { TransformFnParams } from 'class-transformer';

export const CnpjFormatTransform = (data: TransformFnParams) => {
  const cnpj = String(data.obj[data.key]);

  if (!cnpj) return null;

  if (typeof cnpj === 'string') {
    console.log(cnpj, isValidCNPJ(cnpj));
    return onlyNumbers(cnpj);
    // if (isValidCNPJ(cnpj)) {
    // }
  }

  return null;
};
