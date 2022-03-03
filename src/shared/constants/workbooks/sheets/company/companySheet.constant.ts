import { ITableSchema } from 'src/shared/providers/ExcelProvider/models/IExcelProvider.types';

import { companyColumnsConstant } from './companyColumns.constant';
import { CompanySheetEnum } from './companySheet.enum';

export interface ICompanySheet {
  name: string;
  id: CompanySheetEnum;
  columns: ITableSchema[];
}

export const companySheetConstant = {
  [CompanySheetEnum.COMPANIES]: {
    name: 'Empresas',
    id: CompanySheetEnum.COMPANIES,
    columns: companyColumnsConstant,
  },
} as Record<CompanySheetEnum, ICompanySheet>;
