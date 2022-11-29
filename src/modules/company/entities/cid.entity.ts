import { Cid, SexTypeEnum } from '@prisma/client';
import { EmployeeEntity } from './employee.entity';

export class CidEntity implements Cid {
  cid: string;
  description: string;
  employees: EmployeeEntity[];
  class: string;
  sex: SexTypeEnum;
  kill: boolean;

  constructor(partial: Partial<CidEntity>) {
    Object.assign(this, partial);
  }
}
