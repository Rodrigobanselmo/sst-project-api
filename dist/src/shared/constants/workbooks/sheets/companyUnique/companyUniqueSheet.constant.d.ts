import { ITableSchema } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { CompanyUniqueSheetEnum } from './companyUniqueSheet.enum';
export interface ICompanyUniqueSheet {
    name: string;
    id: CompanyUniqueSheetEnum;
    columns: ITableSchema[];
}
export declare const companyUniqueSheetConstant: Record<CompanyUniqueSheetEnum, ICompanyUniqueSheet>;
