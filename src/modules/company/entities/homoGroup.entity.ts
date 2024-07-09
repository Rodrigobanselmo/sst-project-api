import { RiskFactorDataEntity } from '../../sst/entities/riskData.entity';
import { HierarchyOnHomogeneous, HomogeneousGroup, HomoTypeEnum, StatusEnum, Company } from '@prisma/client';
import { HierarchyEntity } from './hierarchy.entity';
import { WorkspaceEntity } from './workspace.entity';
import { CharacterizationEntity } from './characterization.entity';
import { CompanyEntity } from './company.entity';

export class HomoGroupEntity implements HomogeneousGroup {
  id: string;
  name: string;
  description: string;
  status: StatusEnum;
  companyId: string;
  created_at: Date;
  hierarchyOnHomogeneous?: HierarchyOnHomogeneousEntity[];
  hierarchies?: HierarchyEntity[];

  type: HomoTypeEnum;
  riskFactorData?: RiskFactorDataEntity[];
  characterization?: CharacterizationEntity;
  environment?: CharacterizationEntity;
  hierarchy?: HierarchyEntity;
  deletedAt: Date;
  workspaces?: WorkspaceEntity[];
  workspaceIds?: string[];

  employeeCount?: number;
  company?: CompanyEntity;

  constructor(partial: Partial<HomoGroupEntity>) {
    Object.assign(this, partial);

    if (this.type === 'HIERARCHY' && !this.hierarchy && this.hierarchyOnHomogeneous && this.hierarchyOnHomogeneous[0]) {
      this.hierarchy = new HierarchyEntity(this.hierarchyOnHomogeneous[0].hierarchy);
    }
    if (this.workspaces) {
      this.workspaces = this.workspaces.map((w) => new WorkspaceEntity(w));
    }
    if (this.workspaces) {
      this.workspaceIds = this.workspaces.map((w) => w.id);
    }

    if (this.hierarchyOnHomogeneous && !this.hierarchies) {
      this.hierarchies = Object.values(
        this.hierarchyOnHomogeneous.reduce(
          (acc, curr) => {
            if (!curr.hierarchy) return acc;
            if (!acc[curr.hierarchyId]) acc[curr.hierarchyId] = new HierarchyEntity(curr.hierarchy);
            if (!acc[curr.hierarchyId].hierarchyOnHomogeneous) acc[curr.hierarchyId].hierarchyOnHomogeneous = [];

            delete curr.hierarchy;
            acc[curr.hierarchyId].hierarchyOnHomogeneous.push(curr);
            return acc;
          },
          {} as Record<string, HierarchyEntity>,
        ),
      );
    }
  }
}

export class HierarchyOnHomogeneousEntity implements HierarchyOnHomogeneous {
  id: number;
  hierarchyId: string;
  homogeneousGroupId: string;
  hierarchy?: HierarchyEntity;
  homogeneousGroup?: HomoGroupEntity;
  endDate: Date;
  startDate: Date;
  deletedAt: Date;
  created_at: Date;

  constructor(partial: Partial<HomoGroupEntity>) {
    Object.assign(this, partial);
  }
}
