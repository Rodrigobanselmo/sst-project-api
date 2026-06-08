import { DomainError } from "@/@v2/shared/domain/error/domain-error.error"

export const errorCommentRequired = new DomainError(Symbol.for('errorCommentRequired'), 'Comentário é obrigatório')
export const errorCommentTextRequired = new DomainError(Symbol.for('errorCommentTextRequired'), 'Texto do comentário é obrigatório')
export const errorPlanningNotAllowedOnCanceled = new DomainError(Symbol.for('errorPlanningNotAllowedOnCanceled'), 'Planejamento não pode ser editado em ação cancelada')
export const errorEffectivenessNotAllowedForStatus = new DomainError(Symbol.for('errorEffectivenessNotAllowedForStatus'), 'Eficácia não permitida para o status atual da ação')
export const errorEffectivenessCommentRequired = new DomainError(Symbol.for('errorEffectivenessCommentRequired'), 'Comentário da aferição é obrigatório para eficácia parcial ou ineficaz')
export const errorEffectivenessStatusNotAllowed = new DomainError(Symbol.for('errorEffectivenessStatusNotAllowed'), 'Status de eficácia não permitido para o status atual da ação')
