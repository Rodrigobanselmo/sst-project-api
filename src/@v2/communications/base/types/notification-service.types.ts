import { DomainResponse } from '../../../shared/domain/types/shared/domain-response';

export interface INotificationService<T, R> {
  send(data: T): R extends Promise<DomainResponse<any>> ? R : never;
}
