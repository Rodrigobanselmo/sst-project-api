import { DomainError } from '@/@v2/shared/domain/error/domain-error.error';

export const errorFormAlreadyStarted = new DomainError(Symbol.for('errorFormAlreadyStarted'), 'Formulário já iniciado');
export const errorCantChangeToPendingForm = new DomainError(Symbol.for('errorCantChangeTOPendingForm'), 'Formulário já iniciado não pode ser alterado para pendente');
