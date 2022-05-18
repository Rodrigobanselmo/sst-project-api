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
import { WorkspaceRepository } from 'src/modules/company/repositories/implementations/WorkspaceRepository';

@Injectable()
export class UploadEmployeesService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly companyRepository: CompanyRepository,
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

    const system = userPayloadDto.isMaster;
    const companyId = userPayloadDto.targetCompanyId;

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

    const workplaces = await this.workspaceRepository.findByCompany(companyId);

    employeesData = employeesData.map((employee) => {
      const workplace = workplaces.find(
        (work) => work.abbreviation === employee.abbreviation,
      );

      if (!workplace)
        throw new BadRequestException(ErrorCompanyEnum.WORKPLACE_NOT_FOUND);

      delete employee.abbreviation;
      return { ...employee, workplaceId: workplace.id };
    });

    const allHierarchyTree = hierarchyExcel.transformArrayToHierarchyMapTree(
      await this.hierarchyRepository.findAllHierarchyByCompany(companyId),
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
        ({ connectedToOldId, children, fromOld, ...hierarchy }) => ({
          ...hierarchy,
        }),
      );

    const upsertHierarchy = async (type) => {
      await this.hierarchyRepository.upsertMany(
        hierarchyArray.filter((hy) => hy.type === type),
        companyId,
      );
    };

    await asyncEach(Object.keys(HierarchyEnum), upsertHierarchy);

    const employees = employeesData.map((employee) => {
      const newEmployee = { ...employee, cpf: '908' };
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

    // update or create all
    await this.companyRepository.update({
      companyId,
      employees,
      users: [],
    });

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
