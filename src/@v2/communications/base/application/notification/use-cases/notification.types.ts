import { DomainResponse } from '../../../../../shared/domain/types/shared/domain-response';
import { NotificationEnum } from '../../../domain/enums/notification.enum';
import { INotificationService } from '../../../types/notification-service.types';

export type INotificationTypeMap = Record<
  NotificationEnum,
  {
    dto: new () => void;
    service: INotificationService<any, Promise<DomainResponse<any>>>;
  }
>;
