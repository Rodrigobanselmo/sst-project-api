import { EmployeeHierarchyHistory, EmployeeHierarchyMotiveTypeEnum } from '@prisma/client';

import { EmployeeEntity } from './employee.entity';
import { HierarchyEntity } from './hierarchy.entity';

export class EmployeeHierarchyHistoryEntity implements EmployeeHierarchyHistory {
  id: number;
  motive: EmployeeHierarchyMotiveTypeEnum;
  startDate: Date;
  hierarchyId: string;
  employeeId: number;
  created_at: Date;
  updated_at: Date;
  directory?: string;
  management?: string;
  sector?: string;
  office?: string;
  deletedAt: Date;
  employee?: EmployeeEntity;
  hierarchy?: HierarchyEntity;
  subHierarchies?: Partial<HierarchyEntity>[];

  constructor(partial: Partial<EmployeeHierarchyHistoryEntity>) {
    Object.assign(this, partial);

    if (partial?.hierarchy) {
      this.hierarchy = new HierarchyEntity(partial.hierarchy);
    }
  }
}

const base = [
  EmployeeHierarchyMotiveTypeEnum.ALOC,
  EmployeeHierarchyMotiveTypeEnum.PROM,
  EmployeeHierarchyMotiveTypeEnum.TRANS,
  EmployeeHierarchyMotiveTypeEnum.TRANS_PROM,
];
const adm = EmployeeHierarchyMotiveTypeEnum.ADM;
const dem = EmployeeHierarchyMotiveTypeEnum.DEM;
export const historyRules: Record<any, any> = {
  [EmployeeHierarchyMotiveTypeEnum.ADM]: {
    before: [null, dem],
    after: [...base, dem, null],
    canHaveHierarchy: false,
  },
  [EmployeeHierarchyMotiveTypeEnum.TRANS]: {
    before: [...base, adm],
    after: [...base, dem, null],
    canHaveHierarchy: true,
  },
  [EmployeeHierarchyMotiveTypeEnum.PROM]: {
    before: [...base, adm],
    after: [...base, dem, null],
    canHaveHierarchy: true,
  },
  [EmployeeHierarchyMotiveTypeEnum.ALOC]: {
    before: [...base, adm],
    after: [...base, dem, null],
    canHaveHierarchy: true,
  },
  [EmployeeHierarchyMotiveTypeEnum.TRANS_PROM]: {
    before: [...base, adm],
    after: [...base, dem, null],
    canHaveHierarchy: true,
  },
  [EmployeeHierarchyMotiveTypeEnum.DEM]: {
    before: [...base, adm],
    after: [adm, null],
    canHaveHierarchy: true,
  },
  ['null']: {
    before: [...base, adm, dem, null],
    after: [adm, null],
    canHaveHierarchy: true,
  },
};
