import { ApiProperty } from '@nestjs/swagger';

import { Notification, Prisma } from '.prisma/client';

export class NotificationEntity implements Notification {
  @ApiProperty({ description: 'The id of the AccessGroups' })
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
