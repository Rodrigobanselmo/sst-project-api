
import { Notification, Prisma } from '.prisma/client';

export class NotificationEntity implements Notification {
  id: number;
  created_at: Date;
  json: Prisma.JsonValue;
  repeatId: string;
  isClinic: boolean;
  isConsulting: boolean;
  isCompany: boolean;
  isAll: boolean;
  system: boolean;
  companyId: string;

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }
}
