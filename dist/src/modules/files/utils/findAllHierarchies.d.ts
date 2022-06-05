import { ICompanyUniqueSheet } from '../../../shared/constants/workbooks/sheets/companyUnique/companyUniqueSheet.constant';
import { IEmployeeSheet } from '../../../shared/constants/workbooks/sheets/employees/employeesSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { HierarchyRepository } from '../../company/repositories/implementations/HierarchyRepository';
export declare const findAllHierarchies: (excelProvider: ExcelProvider, hierarchyRepository: HierarchyRepository, riskSheet: ICompanyUniqueSheet | IEmployeeSheet, companyId: string) => Promise<{
    sheetName: string;
    rows: any[];
    tableHeader: import("../../../shared/providers/ExcelProvider/models/IExcelProvider.types").ITableSchema[];
}>;
