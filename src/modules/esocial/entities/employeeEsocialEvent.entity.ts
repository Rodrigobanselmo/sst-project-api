import {
  EmployeeESocialEvent,
  EmployeeESocialEventActionEnum,
  EmployeeESocialEventTypeEnum,
  Prisma,
  StatusEnum,
} from '@prisma/client';

import { CatEntity } from './../../company/entities/cat.entity';
import { CompanyEntity } from './../../company/entities/company.entity';
import { EmployeePPPHistoryEntity } from './../../company/entities/employee-ppp-history.entity';
import { EmployeeEntity } from './../../company/entities/employee.entity';
import { EmployeeESocialBatchEntity } from './employeeEsocialBatch.entity';

export class EmployeeESocialEventEntity implements EmployeeESocialEvent {
  id: number;
  created_at: Date;
  updated_at: Date;
  batchId: number;
  environment: number;
  eventsDate: Date;
  status: StatusEnum; // DONE - TRANSMITTED - PROGRESS - INACTIVE - ERROR
  eventXml: string;
  employeeId: number;
  companyId: string;
  type: EmployeeESocialEventTypeEnum;
  receipt: string;
  eventId: string;
  employee?: EmployeeEntity;
  company?: CompanyEntity;
  batch?: EmployeeESocialBatchEntity;
  response: Prisma.JsonValue;
  action: EmployeeESocialEventActionEnum;
  examHistoryId: number;
  ppp: EmployeePPPHistoryEntity;
  pppId: number;
  catId: number;
  cat: CatEntity;

  constructor(partial: Partial<EmployeeESocialEventEntity>) {
    Object.assign(this, partial);
  }
}
