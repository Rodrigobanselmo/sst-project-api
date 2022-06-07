import { ITableSchema } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { CompanySheetEnum } from './companySheet.enum';
export interface ICompanySheet {
    name: string;
    id: CompanySheetEnum;
    columns: ITableSchema[];
}
export declare const companySheetConstant: Record<CompanySheetEnum, ICompanySheet>;
