import {
  EmployeeESocialEvent,
  EmployeeESocialEventTypeEnum,
  StatusEnum,
} from '@prisma/client';

import { CompanyEntity } from './../../company/entities/company.entity';
import { EmployeeEntity } from './../../company/entities/employee.entity';
import { EmployeeESocialBatchEntity } from './employeeEsocialBatch.entity';

export class EmployeeESocialEventEntity implements EmployeeESocialEvent {
  id: number;
  created_at: Date;
  updated_at: Date;
  batchId: number;
  environment: number;
  eventsDate: Date;
  status: StatusEnum;
  eventXml: string;
  responseXml: string;
  employeeId: number;
  companyId: string;
  type: EmployeeESocialEventTypeEnum;
  examHistoryId: number;
  receipt: string;
  eventId: string;
  employee?: EmployeeEntity;
  company?: CompanyEntity;
  batch?: EmployeeESocialBatchEntity;
  // snapshot: Prisma.JsonValue;

  constructor(partial: Partial<EmployeeESocialEventEntity>) {
    Object.assign(this, partial);
  }
}
