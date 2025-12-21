import { EmployeeHierarchyMotiveTypeEnum, HierarchyEnum, SexTypeEnum } from '@prisma/client';
import { UserPayloadDto } from './../../../../../../../shared/dto/user-payload.dto';
import { RiskFactorsEntity } from './../../../../../../sst/entities/risk.entity';
import { UploadCompanyStructureReportDto } from './../../../../../dto/risk-structure-report.dto';

type IDataReturn = { id?: string | number; value: string };
export type IDataReturnHierarchy = IDataReturn & {
  name?: string;
  type?: HierarchyEnum;
  cbo?: string;
  description?: string;
  parentPath?: string;
  realDescription?: string;
};
type IDataReturnHomo = IDataReturn & { description?: string };
type IDataReturnHierarOnHomo = IDataReturn & { hierarchyPath: string; ghoName: string };
type IDataReturnEmployeeHistory = IDataReturn & {
  officePath?: string;
  subOfficePath?: string;
  startDate?: Date;
  motive?: EmployeeHierarchyMotiveTypeEnum;
};

export type IDataReturnEmployee = IDataReturn & {
  name: string;
  sex?: SexTypeEnum;
  birth?: Date;
  rg?: string;
  socialName?: string;
  email?: string;
  phone?: string;
  cbo?: string;
  isPcd?: boolean;
  cids?: Record<string, string>;
  esocialCode?: string;
  lastExam?: Date;
  employeesHistory: Record<string, IDataReturnEmployeeHistory>;
};

export type IHierarchyDataReturn = {
  id: string;
  parentId: string;
  name: string;
  type: HierarchyEnum;
  workspaces: {
    id: string;
  }[];
};
export type IHomoDataReturn = {
  id: string;
  name: string;
};
export type IHierarOnHomoDataReturn = {
  id: number;
  hierarchyId: string;
  homogeneousGroupId: string;
};
export type IWorkDataReturn = {
  id: string;
  name: string;
  abbreviation: string;
};
export type IEpiReturn = {
  id: number;
  ca: string;
};
export type IEmployeeReturn = {
  id: number;
  cpf: string;
};

export interface IWorkspaceData extends IDataReturn {
  hierarchies: Record<string, IDataReturnHierarchy>;
  homogeneousGroup: Record<string, IDataReturnHomo>;
  hierarchyOnHomogeneous: Record<string, IDataReturnHierarOnHomo>;
  employees: Record<string, IDataReturnEmployee>;
  // characterization: Record<string, { type: CharacterizationTypeEnum } & IDataReturn>;
}

export interface IRiskAllData extends IDataReturn {
  generateSource: Record<string, IDataReturn>;
  adms: Record<string, IDataReturn>;
  engs: Record<string, IDataReturn>;
  recs: Record<string, IDataReturn>;
  data: RiskFactorsEntity;
  // Risk creation fields
  severity?: number;
  risk?: string;
  symptoms?: string;
  type?: string;
}

export type IGlobalHierarchy = IDataReturnHierarchy & { workspaceNames: string[] };
export type IGlobalHomoGroup = { value: string; description?: string; workspaceNames: string[] };

export interface IMapData {
  workspace: Record<string, IWorkspaceData>;
  risk: Record<string, IRiskAllData>;
  epis: Record<string, IDataReturn>;
  cids: Record<string, string>;
  // Global maps to track hierarchies/homogroups with all their workspaces
  globalHierarchies: Record<string, IGlobalHierarchy>;
  globalHomoGroups: Record<string, IGlobalHomoGroup>;
}
export interface ICompanyData {
  id: string;
  workspace: {
    id: string;
    name: string;
    abbreviation: string;
  }[];
}

export type IBodyFileCompanyStruct = UploadCompanyStructureReportDto & { user: UserPayloadDto };
