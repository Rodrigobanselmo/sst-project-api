import {
  EmployeeESocialEvent,
  EmployeePPPHistory,
  StatusEnum,
} from '@prisma/client';

import { EmployeeEntity } from './employee.entity';

export class EmployeePPPHistoryEntity implements EmployeePPPHistory {
  id: number;
  created_at: Date;
  updated_at: Date;
  doneDate: Date;
  status: StatusEnum;
  sendEvent: boolean;
  employeeId: number;
  employee: EmployeeEntity;
  events: EmployeeESocialEvent[];

  constructor(partial: Partial<EmployeePPPHistoryEntity>) {
    Object.assign(this, partial);
  }
}
