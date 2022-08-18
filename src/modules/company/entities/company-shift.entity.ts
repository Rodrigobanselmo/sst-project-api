import { CompanyShift } from '@prisma/client';
import { CompanyEntity } from './company.entity';
import { EmployeeEntity } from './employee.entity';

export class CompanyShiftEntity implements CompanyShift {
  id: number;
  name: string;
  description: string;
  companyId: string;
  created_at: Date;
  updated_at: Date;
  employees: EmployeeEntity[];
  company: CompanyEntity;

  constructor(partial: Partial<CompanyShiftEntity>) {
    Object.assign(this, partial);
  }
}
