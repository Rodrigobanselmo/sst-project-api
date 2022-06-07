import { WorkspaceRepository } from '../../../modules/company/repositories/implementations/WorkspaceRepository';
import { IEmployeeSheet } from '../../../shared/constants/workbooks/sheets/employees/employeesSheet.constant';
import { CompanyRepository } from '../../../modules/company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../modules/company/repositories/implementations/HierarchyRepository';
import { ICompanyUniqueSheet } from '../../../shared/constants/workbooks/sheets/companyUnique/companyUniqueSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
export declare const findAllEmployees: (excelProvider: ExcelProvider, companyRepository: CompanyRepository, workspaceRepository: WorkspaceRepository, hierarchyRepository: HierarchyRepository, riskSheet: ICompanyUniqueSheet | IEmployeeSheet, companyId: string) => Promise<{
    sheetName: string;
    rows: any[];
    tableHeader: import("../../../shared/providers/ExcelProvider/models/IExcelProvider.types").ITableSchema[];
}>;
