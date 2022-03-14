import { Hierarchy, HierarchyEnum, StatusEnum } from '@prisma/client';
import { CompanyRepository } from 'src/modules/company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from 'src/modules/company/repositories/implementations/HierarchyRepository';
import { ICompanyUniqueSheet } from 'src/shared/constants/workbooks/sheets/companyUnique/companyUniqueSheet.constant';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';
import { getPathIdTreeMap } from 'src/shared/utils/getPathIdTreeMap';
import { statusEnumTranslateUsToBr } from 'src/shared/utils/translate/statusEnum.translate';
import { HierarchyExcelProvider } from '../providers/HierarchyExcelProvider';

export const findAllEmployees = async (
  excelProvider: ExcelProvider,
  companyRepository: CompanyRepository,
  hierarchyRepository: HierarchyRepository,
  riskSheet: ICompanyUniqueSheet,
  companyId: string,
) => {
  const hierarchyExcel = new HierarchyExcelProvider();
  const company = await companyRepository.findById(companyId, {
    include: { employees: true },
  });

  const hierarchies = await hierarchyRepository.findAllHierarchyByCompany(
    companyId,
  );

  const hierarchyTree =
    hierarchyExcel.transformArrayToHierarchyMapTree(hierarchies);

  company.employees = company.employees.map((employee) => {
    const hierarchyId = employee.hierarchyId;
    if (hierarchyId) {
      const pathIds = getPathIdTreeMap(hierarchyId, hierarchyTree);
      const pathsHierarchy = pathIds.map((id) => hierarchyTree[id]);

      const newEmployee = { ...employee };
      newEmployee.status = statusEnumTranslateUsToBr(
        newEmployee.status,
      ) as StatusEnum;

      Object.values(HierarchyEnum).forEach((type) => {
        const hierarchy = pathsHierarchy.find(
          (h) => h.type === type,
        ) as Hierarchy;

        if (hierarchy) {
          newEmployee[type.toLocaleLowerCase()] = hierarchy.name;
        }
      });

      return newEmployee;
    }
    return employee;
  });

  const excelRows = await excelProvider.transformToExcelData(
    [company],
    riskSheet.columns,
  );

  return {
    sheetName: riskSheet.name,
    rows: excelRows,
    tableHeader: riskSheet.columns,
  };
};
