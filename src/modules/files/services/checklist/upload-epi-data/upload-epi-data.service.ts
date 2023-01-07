import { BadRequestException, Injectable } from '@nestjs/common';
import { EpiRepository } from '../../../../sst/repositories/implementations/EpiRepository';
import { findAllEpis } from '../../../../../modules/files/utils/findAllEpis';
import { IEpiSheet } from '../../../../../shared/constants/workbooks/sheets/epi/epiSheet.constant';
import { removeDuplicate } from '../../../../../shared/utils/removeDuplicate';

import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IExcelReadData } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { DatabaseTableEntity } from '../../../entities/databaseTable.entity';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';

@Injectable()
export class UploadEpiDataService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly epiRepository: EpiRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
    private readonly uploadExcelProvider: UploadExcelProvider,
  ) {}

  async execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    const riskWorkbook = workbooksConstant[WorkbooksEnum.EPI];

    const system = userPayloadDto.isSystem;
    const companyId = userPayloadDto.targetCompanyId;

    // get risk table with actual version
    const riskDatabaseTable = await this.databaseTableRepository.findByNameAndCompany(riskWorkbook.name, companyId);

    const allEpi = await this.uploadExcelProvider.getAllData({
      buffer,
      Workbook: riskWorkbook,
      read: readEpis,
      DatabaseTable: riskDatabaseTable,
    });

    console.info('remove duplicates');

    const duplicates = removeDuplicate(allEpi, { removeById: 'ca' });

    console.info('reduce');

    const arr = duplicates.reduce((acc, epi, index) => {
      const i = Math.floor(index / 1000);
      if (!acc[i]) acc[i] = [];
      acc[i].push(epi);
      return acc;
    }, [] as any[]);

    console.info('start');

    await Promise.all(arr.map(async (data) => await this.epiRepository.upsertMany(data)));

    console.info('done');

    return await this.uploadExcelProvider.newTableData({
      findAll: (sheet) => findAllEpis(this.excelProvider, this.epiRepository, sheet),
      Workbook: riskWorkbook,
      system,
      companyId,
      DatabaseTable: riskDatabaseTable,
    });
  }
}

const readEpis = async (readFileData: IExcelReadData[], excelProvider: ExcelProvider, epiSheet: IEpiSheet, databaseTable: DatabaseTableEntity) => {
  const episTable = readFileData.find((data) => data.name === epiSheet.name);

  if (!episTable)
    throw new BadRequestException(`The table you trying to insert has a different sheet name: ${readFileData.join(', ')} than the expected: ${epiSheet.name}`);

  const epiDatabase = await excelProvider.transformToTableData(episTable, epiSheet.columns);

  if (databaseTable?.version && epiDatabase.version !== databaseTable.version)
    throw new BadRequestException('The table you trying to insert has a different version, make sure you have the newest table version');

  return epiDatabase.rows;
};
