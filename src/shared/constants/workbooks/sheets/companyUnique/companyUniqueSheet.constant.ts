import { ITableSchema } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { companyUniqueColumnsConstant } from './companyUniqueColumns.constant';

import { CompanyUniqueSheetEnum } from './companyUniqueSheet.enum';

export interface ICompanyUniqueSheet {
  name: string;
  id: CompanyUniqueSheetEnum;
  columns: ITableSchema[];
}

export const companyUniqueSheetConstant = {
  [CompanyUniqueSheetEnum.COMPANIES]: {
    name: 'Empresa',
    id: CompanyUniqueSheetEnum.COMPANIES,
    columns: companyUniqueColumnsConstant,
  },
} as Record<CompanyUniqueSheetEnum, ICompanyUniqueSheet>;
