import { EmployeeRepository } from './../../../../company/repositories/implementations/EmployeeRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HierarchyExcelProvider } from '../../../providers/HierarchyExcelProvider';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { findAllEmployees } from '../../../utils/findAllEmployees';
import {
  ErrorCompanyEnum,
  ErrorMessageEnum,
} from '../../../../../shared/constants/enum/errorMessage';
import { ICompanySheet } from '../../../../../shared/constants/workbooks/sheets/company/companySheet.constant';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IExcelReadData } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { asyncEach } from '../../../../../shared/utils/asyncEach';

import { DatabaseTableEntity } from '../../../entities/databaseTable.entity';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
import { WorkspaceRepository } from '../../../../../modules/company/repositories/implementations/WorkspaceRepository';
import { hierarchyList } from '../../../../../shared/constants/lists/hierarchy.list';

@Injectable()
export class UploadEmployeesService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly companyRepository: CompanyRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
    private readonly uploadExcelProvider: UploadExcelProvider,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}

  async execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;
    const hierarchyExcel = new HierarchyExcelProvider();

    const Workbook = workbooksConstant[WorkbooksEnum.EMPLOYEES];

    const system = userPayloadDto.isSystem;
    const companyId = userPayloadDto.targetCompanyId;

    //! fetching twice company (also on findAllEmployees)
    const company = await this.companyRepository.findById(companyId, {
      include: { workspace: true },
    });

    if (company.workspace?.length === 1)
      Workbook.sheets[0].columns = Workbook.sheets[0].columns.filter(
        (column) => column.databaseName !== 'abbreviation',
      );

    // get risk table with actual version
    const DatabaseTable =
      await this.databaseTableRepository.findByNameAndCompany(
        Workbook.name,
        companyId,
      );

    let employeesData = await this.uploadExcelProvider.getAllData({
      buffer,
      Workbook,
      read,
      DatabaseTable,
    });

    const workspaces = await this.workspaceRepository.findByCompany(companyId);
    const ghoNameDescriptionMap = {} as Record<string, string>;

    employeesData = employeesData.map((employee) => {
      const workspace =
        company.workspace?.length === 1
          ? workspaces
          : workspaces.filter(
              (work) =>
                employee?.abbreviation &&
                employee?.abbreviation.includes(work.abbreviation),
            );

      if (!workspace)
        throw new BadRequestException(ErrorCompanyEnum.WORKSPACE_NOT_FOUND);

      if (employee.ghoName) {
        ghoNameDescriptionMap[employee.ghoName] =
          ghoNameDescriptionMap[employee.ghoName] ||
          employee.ghoDescription ||
          '';
      }

      if (employee?.abbreviation) delete employee.abbreviation;
      return { ...employee, workspaceIds: workspace.map((work) => work.id) };
    });

    const allHierarchyTree = hierarchyExcel.transformArrayToHierarchyMapTree(
      await this.hierarchyRepository.findAllHierarchyByCompany(companyId, {
        include: { workspaces: true },
      }),
    );

    const sheetHierarchyTree =
      hierarchyExcel.createTreeMapFromHierarchyStruct(employeesData);

    const hierarchyTree = hierarchyExcel.compare(
      allHierarchyTree,
      sheetHierarchyTree,
    );

    const hierarchyArray = Object.values(hierarchyTree)
      .filter((hierarchy) => !hierarchy.refId)
      .map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ connectedToOldId, children, fromOld, type, ...hierarchy }) => ({
          ...hierarchy,
          type: type as HierarchyEnum,
          ghoName: type == HierarchyEnum.OFFICE ? hierarchy.ghoName : '',
        }),
      );

    const upsertHierarchy = async (type) => {
      await this.hierarchyRepository.upsertMany(
        hierarchyArray.filter((hy) => hy.type === type),
        companyId,
        ghoNameDescriptionMap,
      );
    };

    await asyncEach(hierarchyList, upsertHierarchy);

    const employees = employeesData.map((employee) => {
      if (employee.ghoName) delete employee.ghoName;
      const newEmployee = { ...employee };
      let hierarchy = null as any;

      const getByNameHierarchy = () => {
        Object.keys(HierarchyEnum).forEach((key) => {
          const hierarchyName = newEmployee[key.toLocaleLowerCase()];
          delete newEmployee[key.toLocaleLowerCase()];

          if (hierarchyName) {
            const children = hierarchy
              ? hierarchy.children.map((child) => hierarchyTree[child])
              : Object.values(hierarchyTree);

            const actualHierarchy = children.find(
              (h) =>
                h?.name &&
                h?.type &&
                h.name === hierarchyName &&
                h.type === key,
            );

            if (actualHierarchy) {
              hierarchy = actualHierarchy;
              newEmployee.hierarchyId = actualHierarchy.id;
            }
          }
        });
      };

      getByNameHierarchy();

      return newEmployee;
    });

    const restEMployees = employees.map((employee) => {
      delete employee.description;
      delete employee.ghoDescription;
      delete employee.realDescription;
      delete employee.workspaceIds;
      return employee;
    });

    // update or create all
    await this.employeeRepository.upsertMany(restEMployees, companyId);

    return await this.uploadExcelProvider.newTableData({
      findAll: (sheet) =>
        findAllEmployees(
          this.excelProvider,
          this.companyRepository,
          this.workspaceRepository,
          this.hierarchyRepository,
          sheet,
          companyId,
        ),
      Workbook,
      system,
      companyId,
      DatabaseTable,
    });
  }
}

const read = async (
  readFileData: IExcelReadData[],
  excelProvider: ExcelProvider,
  sheet: ICompanySheet,
  databaseTable: DatabaseTableEntity,
) => {
  const table = readFileData.find((data) => data.name === sheet.name);

  if (!table)
    throw new BadRequestException(
      'The table you trying to insert has a different sheet name',
    );

  const database = await excelProvider.transformToTableData(
    table,
    sheet.columns,
  );

  if (databaseTable?.version && database.version !== databaseTable.version)
    throw new BadRequestException(ErrorMessageEnum.FILE_WRONG_TABLE_HEAD);

  return database.rows;
};
