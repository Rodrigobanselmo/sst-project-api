import { DomainError } from '@/@v2/shared/domain/error/domain-error.error';

export const errorFileNotFound = new DomainError(Symbol.for('errorFileNotFound'), 'Arquivo não encontrado');
