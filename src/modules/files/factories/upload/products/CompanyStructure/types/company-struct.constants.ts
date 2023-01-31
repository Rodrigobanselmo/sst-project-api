import { ClothesIBTUG } from '../../../../../../../shared/constants/maps/ibtu-clothes.map';
import { checkIsValidDate } from '../../../../../../../shared/utils/validators/checkIsValidDate';
import { checkIsBoolean } from '../../../../../../../shared/utils/validators/checkIsBoolean';
import { checkIsNumber } from '../../../../../../../shared/utils/validators/checkIdNumber';
import { IColumnRuleMap, ISheetRuleMap } from '../../../types/IFileFactory.types';
import { checkIsString } from '../../../../../../../shared/utils/validators/checkIsString';
import { checkIsEnum } from '../../../../../../../shared/utils/validators/checkIsEnum';
import { CharacterizationTypeEnum } from '@prisma/client';
import { CompanyStructHeaderEnum } from '../constants/company-struct.constants';

export interface IBodyCompStructFile {
  companyId: string;
}

type IWorkspaceDataReturn = { id?: string | number; value: string };

export interface IWorkspaceData extends IWorkspaceDataReturn {
  hierarchies: Record<string, IWorkspaceDataReturn[]>;
  homogeneousGroup: Record<string, IWorkspaceDataReturn>;
  characterization: Record<string, { type: CharacterizationTypeEnum } & IWorkspaceDataReturn>;
  risk: Record<
    string,
    {
      generateSource: Record<string, IWorkspaceDataReturn>;
      adms: Record<string, IWorkspaceDataReturn>;
      engs: Record<string, IWorkspaceDataReturn>;
      recs: Record<string, IWorkspaceDataReturn>;
      epis: Record<string, IWorkspaceDataReturn>;
    } & IWorkspaceDataReturn
  >;
}
