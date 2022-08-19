import {
  EmployeeHierarchyHistory,
  EmployeeHierarchyMotiveTypeEnum,
} from '@prisma/client';

import { EmployeeEntity } from './employee.entity';
import { HierarchyEntity } from './hierarchy.entity';

export class EmployeeHierarchyHistoryEntity
  implements EmployeeHierarchyHistory
{
  id: number;
  motive: EmployeeHierarchyMotiveTypeEnum;
  startDate: Date;
  hierarchyId: string;
  employeeId: number;
  employee: EmployeeEntity;
  created_at: Date;
  updated_at: Date;
  hierarchy: HierarchyEntity;
  directory?: string;
  management?: string;
  sector?: string;
  office?: string;

  constructor(partial: Partial<EmployeeHierarchyHistoryEntity>) {
    Object.assign(this, partial);
  }
}
