import { DomainError } from '@/@v2/shared/domain/error/domain-error.error';

export const errorEmailFail = new DomainError(Symbol.for('errorEmailFail'), 'Failed to send email');
