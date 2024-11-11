import { DomainError } from "@/@v2/shared/domain/error/domain-error.error"

export const errorCommentRequired = new DomainError(Symbol.for('errorCommentRequired'), 'Comentário é obrigatório')
export const errorCommentTextRequired = new DomainError(Symbol.for('errorCommentTextRequired'), 'Texto do comentário é obrigatório')
