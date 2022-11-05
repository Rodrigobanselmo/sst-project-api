import { ApiProperty } from '@nestjs/swagger';
import { EmployeeESocialEvent, Prisma, StatusEnum } from '@prisma/client';

export class EmployeeESocialEventEntity implements EmployeeESocialEvent {
  id: number;
  created_at: Date;
  updated_at: Date;
  batchId: number;
  environment: number;
  eventsDate: Date;
  status: StatusEnum;
  snapshot: Prisma.JsonValue;
  eventXml: string;
  responseXml: string;
  employeeId: number;
  companyId: string;
  examHistoryId: number;

  constructor(partial: Partial<EmployeeESocialEventEntity>) {
    Object.assign(this, partial);
  }
}
