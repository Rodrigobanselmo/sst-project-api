import { HierarchyEnum, StatusEnum } from '@prisma/client';
import { hierarchyList } from '../../../shared/constants/lists/hierarchy.list';

import { HierarchyEntity } from '../../../modules/company/entities/hierarchy.entity';
import { CompanyRepository } from '../../../modules/company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../modules/company/repositories/implementations/HierarchyRepository';
import { WorkspaceRepository } from '../../../modules/company/repositories/implementations/WorkspaceRepository';
import { ICompanyUniqueSheet } from '../../../shared/constants/workbooks/sheets/companyUnique/companyUniqueSheet.constant';
import { IEmployeeSheet } from '../../../shared/constants/workbooks/sheets/employees/employeesSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { getPathIdTreeMap } from '../../../shared/utils/getPathIdTreeMap';
import { statusEnumTranslateUsToBr } from '../../../shared/utils/translate/statusEnum.translate';
import { HierarchyExcelProvider } from '../providers/HierarchyExcelProvider';

export const findAllEmployees = async (
  excelProvider: ExcelProvider,
  companyRepository: CompanyRepository,
  workspaceRepository: WorkspaceRepository,
  hierarchyRepository: HierarchyRepository,
  riskSheet: ICompanyUniqueSheet | IEmployeeSheet,
  companyId: string,
) => {
  const hierarchyExcel = new HierarchyExcelProvider();
  const company = await companyRepository.findById(companyId, {
    include: { employees: true, workspace: true },
  });

  if (company.workspace?.length === 1)
    riskSheet.columns = riskSheet.columns.filter(
      (column) => column.databaseName !== 'abbreviation',
    );

  const hierarchies = await hierarchyRepository.findAllHierarchyByCompany(
    companyId,
    {
      include: {
        hierarchyOnHomogeneous: {
          include: {
            homogeneousGroup: {
              include: { characterization: true, environment: true },
            },
          },
        },
      },
    },
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

      hierarchyList.forEach((type) => {
        const hierarchy = pathsHierarchy.find(
          (h) => h.type === type,
        ) as HierarchyEntity;

        if (hierarchy) {
          //* update here to add more on download
          newEmployee[type.toLocaleLowerCase()] = hierarchy.name;

          if (hierarchy.homogeneousGroups) {
            const foundHomo = hierarchy.homogeneousGroups
              .reverse()
              .find((hierarchy) => !hierarchy.type);

            (newEmployee as any).ghoName = foundHomo?.name || '';
            (newEmployee as any).ghoDescription = foundHomo?.description || '';
          }

          if ([HierarchyEnum.OFFICE].includes(type.toUpperCase() as any)) {
            (newEmployee as any).description = hierarchy?.description || '';
            (newEmployee as any).realDescription =
              hierarchy?.realDescription || '';
          }
        }
      });

      return newEmployee;
    }
    return employee;
  });

  const workspaces = await workspaceRepository.findByCompany(companyId);

  company.employees = company.employees.map((employee) => {
    const workspace = workspaces.find(
      (workspace) =>
        employee.workspaces &&
        employee.workspaces.find((w) => w.id == workspace.id),
    );

    return {
      ...employee,
      abbreviation: workspace.abbreviation,
    };
  });

  const excelRows = await excelProvider.transformToExcelData(
    company.employees,
    riskSheet.columns,
  );

  return {
    sheetName: riskSheet.name,
    rows: excelRows,
    tableHeader: riskSheet.columns,
  };
};
