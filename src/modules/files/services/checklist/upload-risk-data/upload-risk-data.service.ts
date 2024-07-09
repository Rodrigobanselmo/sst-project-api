import { BadRequestException, Injectable } from '@nestjs/common';
import { RiskRepository } from '../../../../sst/repositories/implementations/RiskRepository';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { IRiskSheet } from '../../../../../shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IExcelReadData } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';

import { DatabaseTableEntity } from '../../../entities/databaseTable.entity';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
import { findAllRisks } from '../../../utils/findAllRisks';

@Injectable()
export class UploadChecklistDataService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly riskRepository: RiskRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
    private readonly uploadExcelProvider: UploadExcelProvider,
  ) {}

  async execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    const riskWorkbook = workbooksConstant[WorkbooksEnum.RISK];

    const system = userPayloadDto.isSystem;
    const companyId = userPayloadDto.targetCompanyId;

    // get risk table with actual version
    const riskDatabaseTable = await this.databaseTableRepository.findByNameAndCompany(riskWorkbook.name, companyId);

    const allRisks = await this.uploadExcelProvider.getAllData({
      buffer,
      Workbook: riskWorkbook,
      read: readRisks,
      DatabaseTable: riskDatabaseTable,
    });
    // update or create all risks
    await this.riskRepository.upsertMany(allRisks, system, companyId);

    return await this.uploadExcelProvider.newTableData({
      findAll: (sheet) => findAllRisks(this.excelProvider, this.riskRepository, sheet, companyId),
      Workbook: riskWorkbook,
      system,
      companyId,
      DatabaseTable: riskDatabaseTable,
    });
  }
}

const readRisks = async (
  readFileData: IExcelReadData[],
  excelProvider: ExcelProvider,
  riskSheet: IRiskSheet,
  databaseTable: DatabaseTableEntity,
) => {
  const risksTable = readFileData.find((data) => data.name === riskSheet.name);

  if (!risksTable) throw new BadRequestException('The table you trying to insert has a different sheet name');

  const riskDatabase = await excelProvider.transformToTableData(risksTable, riskSheet.columns);

  if (databaseTable?.version && riskDatabase.version !== databaseTable.version)
    throw new BadRequestException(
      'The table you trying to insert has a different version, make sure you have the newest table version',
    );

  return riskDatabase.rows.map((risk) => ({ type: riskSheet.type, ...risk }));
};
