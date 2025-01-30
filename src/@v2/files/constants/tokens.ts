/**
 * The tokens are used to inject the dependencies in the classes.
 */

export class DocumentTokens {
  // Repositories
  static readonly DocumentRepository = Symbol('DocumentRepository')

  // Services
  static readonly ReadDocumentService = Symbol('ReadDocumentService')
  static readonly AddDocumentService = Symbol('AddDocumentService')
  static readonly DeleteUnusedDocumentService = Symbol('DeleteUnusedDocumentService')
}
