import { DomainError } from '@/@v2/shared/domain/error/domain-error.error';

export const errorTaskNotFound = new DomainError(Symbol.for('errorTaskNotFound'), 'Tarefa não encontrado');
export const errorTaskMemberAlreadyExist = new DomainError(Symbol.for('errorTaskMemberAlreadyExist'), 'Usuário já é membro do projeto');
export const errorTaskMemberCantRemoveIsAdmin = new DomainError(Symbol.for('errorTaskMemberCantRemoveIsAdmin'), 'Usuário não pode ser removido do projeto, pois é o administrador');
