import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/modules/company/repositories/implementations/CompanyRepository';
import { UploadExcelProvider } from 'src/modules/files/providers/uploadExcelProvider';
import { findAllCompanies } from 'src/modules/files/utils/findAllCompanies';
import { ICompanySheet } from 'src/shared/constants/workbooks/sheets/company/companySheet.constant';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from 'src/shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IExcelReadData } from 'src/shared/providers/ExcelProvider/models/IExcelProvider.types';

import { DatabaseTableEntity } from '../../../entities/databaseTable.entity';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';

@Injectable()
export class UploadCompaniesService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly companyRepository: CompanyRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
    private readonly uploadExcelProvider: UploadExcelProvider,
  ) {}

  async execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    const Workbook = workbooksConstant[WorkbooksEnum.COMPANIES];

    const system = userPayloadDto.isMaster;
    const companyId = userPayloadDto.targetCompanyId;

    // get risk table with actual version
    const DatabaseTable =
      await this.databaseTableRepository.findByNameAndCompany(
        Workbook.name,
        companyId,
      );

    const allCompanies = await this.uploadExcelProvider.getAllData({
      buffer,
      Workbook,
      read,
      DatabaseTable,
    });

    // update or create all
    await this.companyRepository.upsertMany(allCompanies);

    return await this.uploadExcelProvider.newTableData({
      findAll: (sheet) =>
        findAllCompanies(
          this.excelProvider,
          this.companyRepository,
          sheet,
          companyId,
          userPayloadDto.isMaster,
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

  const database = await excelProvider.transformToTableData(
    table,
    sheet.columns,
  );

  if (databaseTable?.version && database.version !== databaseTable.version)
    throw new BadRequestException(
      'The table you trying to insert has a different version, make sure you have the newest table version',
    );

  return database.rows;
};