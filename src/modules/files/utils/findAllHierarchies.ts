import { ICompanyUniqueSheet } from '../../../shared/constants/workbooks/sheets/companyUnique/companyUniqueSheet.constant';
import { IEmployeeSheet } from '../../../shared/constants/workbooks/sheets/employees/employeesSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { HierarchyRepository } from '../../company/repositories/implementations/HierarchyRepository';

export const findAllHierarchies = async (
  excelProvider: ExcelProvider,
  hierarchyRepository: HierarchyRepository,
  riskSheet: ICompanyUniqueSheet | IEmployeeSheet,
  companyId: string,
) => {
  const excelRows = await excelProvider.transformToExcelData([], riskSheet.columns);

  return {
    sheetName: riskSheet.name,
    rows: excelRows,
    tableHeader: riskSheet.columns,
  };
};
