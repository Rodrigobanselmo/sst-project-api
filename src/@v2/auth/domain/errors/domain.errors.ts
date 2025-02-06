import { DomainError } from '@/@v2/shared/domain/error/domain-error.error';

export const errorEmployeeAlreadyCreated = new DomainError(Symbol.for('errorEmployeeNotFound'), 'Funcionário já cadastrado');
export const errorUserAlreadyCreated = new DomainError(Symbol.for('errorUserAlreadyCreated'), 'Usuário já cadastrado');
