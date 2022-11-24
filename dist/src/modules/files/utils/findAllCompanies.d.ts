import { CompanyRepository } from '../../../modules/company/repositories/implementations/CompanyRepository';
import { ICompanySheet } from '../../../shared/constants/workbooks/sheets/company/companySheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
export declare const findAllCompanies: (excelProvider: ExcelProvider, companyRepository: CompanyRepository, riskSheet: ICompanySheet, companyId: string, isMaster: boolean) => Promise<{
    sheetName: string;
    rows: any[];
    tableHeader: import("../../../shared/providers/ExcelProvider/models/IExcelProvider.types").ITableSchema[];
}>;
