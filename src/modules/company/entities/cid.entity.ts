import { Cid } from '@prisma/client';
import { EmployeeEntity } from './employee.entity';

export class CidEntity implements Cid {
  cid: string;
  description: string;
  employees: EmployeeEntity[];

  constructor(partial: Partial<CidEntity>) {
    Object.assign(this, partial);
  }
}
