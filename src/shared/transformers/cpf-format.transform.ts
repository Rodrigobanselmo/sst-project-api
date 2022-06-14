import { onlyNumbers, isValidCPF } from '@brazilian-utils/brazilian-utils';
import { TransformFnParams } from 'class-transformer';

export const CpfFormatTransform = (data: TransformFnParams) => {
  const cpf = String(data.obj[data.key]);

  if (!cpf) return null;

  if (typeof cpf === 'string') {
    if (isValidCPF(cpf)) {
      return onlyNumbers(cpf);
    }
  }

  return null;
};
