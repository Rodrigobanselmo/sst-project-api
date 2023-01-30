import { FileCompanyStructureFactory } from '../../../factories/upload/products/CompanyStructure/FileCompanyStructureFactory';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HierarchyExcelProvider } from '../../../providers/HierarchyExcelProvider';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { findAllEmployees } from '../../../utils/findAllEmployees';
import { ErrorCompanyEnum, ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { ICompanySheet } from '../../../../../shared/constants/workbooks/sheets/company/companySheet.constant';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IExcelReadData } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { asyncEach } from '../../../../../shared/utils/asyncEach';

import { DatabaseTableEntity } from '../../../entities/databaseTable.entity';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
import { WorkspaceRepository } from '../../../../company/repositories/implementations/WorkspaceRepository';
import { hierarchyList } from '../../../../../shared/constants/lists/hierarchy.list';

@Injectable()
export class UploadCompanyStructureService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly fileCompanyStructureFactory: FileCompanyStructureFactory,
    private readonly employeeRepository: EmployeeRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
    private readonly uploadExcelProvider: UploadExcelProvider,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    await this.fileCompanyStructureFactory.execute(buffer);

    const hierarchyExcel = new HierarchyExcelProvider();

    const Workbook = workbooksConstant[WorkbooksEnum.EMPLOYEES];

    const system = userPayloadDto.isSystem;
    const companyId = userPayloadDto.targetCompanyId;

    return;
  }
}

const read = async (readFileData: IExcelReadData[], excelProvider: ExcelProvider, sheet: ICompanySheet, databaseTable: DatabaseTableEntity) => {
  const table = readFileData.find((data) => data.name === sheet.name);

  if (!table) throw new BadRequestException('The table you trying to insert has a different sheet name');

  const database = await excelProvider.transformToTableData(table, sheet.columns);

  if (databaseTable?.version && database.version !== databaseTable.version) throw new BadRequestException(ErrorMessageEnum.FILE_WRONG_TABLE_HEAD);

  return database.rows;
};
