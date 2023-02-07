import { RiskFactorsEntity } from './../../../../../../sst/entities/risk.entity';
import { ClothesIBTUG } from '../../../../../../../shared/constants/maps/ibtu-clothes.map';
import { checkIsValidDate } from '../../../../../../../shared/utils/validators/checkIsValidDate';
import { checkIsBoolean } from '../../../../../../../shared/utils/validators/checkIsBoolean';
import { checkIsNumber } from '../../../../../../../shared/utils/validators/checkIdNumber';
import { IColumnRuleMap, ISheetRuleMap } from '../../../types/IFileFactory.types';
import { checkIsString } from '../../../../../../../shared/utils/validators/checkIsString';
import { checkIsEnum } from '../../../../../../../shared/utils/validators/checkIsEnum';
import { CharacterizationTypeEnum, HierarchyEnum, RiskFactors } from '@prisma/client';
import { CompanyStructHeaderEnum } from '../constants/company-struct.constants';

type IDataReturn = { id?: string | number; value: string };
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
export type IWorkDataReturn = {
  id: string;
  name: string;
  abbreviation: string;
};
export type IEpiReturn = {
  id: number;
  ca: string;
};

export interface IWorkspaceData extends IDataReturn {
  hierarchies: Record<string, IDataReturn>;
  homogeneousGroup: Record<string, IDataReturn>;
  // characterization: Record<string, { type: CharacterizationTypeEnum } & IDataReturn>;
}

export interface IRiskAllData extends IDataReturn {
  generateSource: Record<string, IDataReturn>;
  adms: Record<string, IDataReturn>;
  engs: Record<string, IDataReturn>;
  recs: Record<string, IDataReturn>;
  data: RiskFactorsEntity;
}

export interface IMapData {
  workspace: Record<string, IWorkspaceData>;
  risk: Record<string, IRiskAllData>;
  epis: Record<string, IDataReturn>;
}
