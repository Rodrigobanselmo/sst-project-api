import { DomainError } from '@/@modules/shared/errors'

export const errorDocumentNotFound = new DomainError(Symbol.for('DocumentNotFound'), 'Document not found')
