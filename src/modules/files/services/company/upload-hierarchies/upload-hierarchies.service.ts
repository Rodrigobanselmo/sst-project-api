import { hierarchyList } from './../../../../../shared/constants/lists/hierarchy.list';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';

import { ErrorCompanyEnum, ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { ICompanySheet } from '../../../../../shared/constants/workbooks/sheets/company/companySheet.constant';
import { IHierarchiesColumns } from '../../../../../shared/constants/workbooks/sheets/hierarchies/hierarchiesColumns.constant';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IExcelReadData } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { asyncEach } from '../../../../../shared/utils/asyncEach';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { WorkspaceRepository } from '../../../../company/repositories/implementations/WorkspaceRepository';
import { DatabaseTableEntity } from '../../../entities/databaseTable.entity';
import { HierarchyExcelProvider } from '../../../providers/HierarchyExcelProvider';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';

export type HierarchyOnHomogeneous = {
  hierarchyId: string;
  homogeneousGroupId: string;
  workspaceId: string;
};

@Injectable()
export class UploadHierarchiesService {
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

    const Workbook = workbooksConstant[WorkbooksEnum.HIERARCHIES];

    const companyId = userPayloadDto.targetCompanyId;

    // get risk table with actual version
    const DatabaseTable = await this.databaseTableRepository.findByNameAndCompany(Workbook.name, companyId);

    let hierarchiesExcelData: IHierarchiesColumns[] = await this.uploadExcelProvider.getAllData({
      buffer,
      Workbook,
      read,
      DatabaseTable,
    });

    const workspaces = await this.workspaceRepository.findByCompany(companyId);
    const ghoNameDescriptionMap = {} as Record<string, string>;

    hierarchiesExcelData = hierarchiesExcelData.map((hierarchy) => {
      const workspace = workspaces.filter(
        (work) => hierarchy.abbreviation && hierarchy.abbreviation.includes(work.abbreviation),
      );

      if (!workspace) throw new BadRequestException(ErrorCompanyEnum.WORKSPACE_NOT_FOUND);

      if (hierarchy.ghoName) {
        ghoNameDescriptionMap[hierarchy.ghoName] = hierarchy.ghoDescription;
      }

      delete hierarchy.abbreviation;
      return { ...hierarchy, workspaceIds: workspace.map((work) => work.id) };
    }) as IHierarchiesColumns[];

    //! REMOVE AFTER TEST

    hierarchiesExcelData = hierarchiesExcelData.reduce((acc, hierarchy) => {
      const offices = hierarchy.office.split('/').reduce((acc, office) => {
        return [
          ...acc,
          ...office.split(';').reduce((acc, office) => {
            return [...acc, ...office.split(',')];
          }, []),
        ];
      }, []);

      const newHierarchies = offices.map((office) => {
        return {
          ...hierarchy,
          office: office.trim(),
        } as IHierarchiesColumns;
      });
      return [...acc, ...newHierarchies];
    }, [] as IHierarchiesColumns[]);

    //!  REMOVE AFTER TEST

    const allHierarchyTree = hierarchyExcel.transformArrayToHierarchyMapTree(
      await this.hierarchyRepository.findAllHierarchyByCompany(companyId, {
        include: { workspaces: true },
      }),
    );

    const sheetHierarchyTree = hierarchyExcel.createTreeMapFromHierarchyStruct(hierarchiesExcelData);

    const hierarchyTree = hierarchyExcel.compare(allHierarchyTree, sheetHierarchyTree);

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

    // return await this.uploadExcelProvider.newTableData({
    //   findAll: (sheet) =>
    //     findAllEmployees(
    //       this.excelProvider,
    //       this.companyRepository,
    //       this.workspaceRepository,
    //       this.hierarchyRepository,
    //       sheet,
    //       companyId,
    //     ),
    //   Workbook,
    //   system,
    //   companyId,
    //   DatabaseTable,
    // });
  }
}

const read = async (
  readFileData: IExcelReadData[],
  excelProvider: ExcelProvider,
  sheet: ICompanySheet,
  databaseTable: DatabaseTableEntity,
) => {
  const table = readFileData.find((data) => data.name === sheet.name);

  if (!table) throw new BadRequestException('The table you trying to insert has a different sheet name');

  const database = await excelProvider.transformToTableData(table, sheet.columns);

  if (databaseTable?.version && database.version !== databaseTable.version)
    throw new BadRequestException(ErrorMessageEnum.FILE_WRONG_TABLE_HEAD);

  return database.rows;
};
