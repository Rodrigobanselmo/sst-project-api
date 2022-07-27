import { ErrorFilesEnum } from './../../../../../shared/constants/enum/errorMessage';
import { findAllCnaes } from './../../../utils/findAllCnae';
import { ActivityRepository } from './../../../../company/repositories/implementations/ActivityRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ICnaeSheet } from '../../../../../shared/constants/workbooks/sheets/cnae/cnaeSheet.constant';
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
export class UploadCnaeDataService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly activityRepository: ActivityRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
    private readonly uploadExcelProvider: UploadExcelProvider,
  ) {}

  async execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    const riskWorkbook = workbooksConstant[WorkbooksEnum.CNAE];

    const system = userPayloadDto.isSystem;
    const companyId = userPayloadDto.targetCompanyId;

    // get risk table with actual version
    const riskDatabaseTable =
      await this.databaseTableRepository.findByNameAndCompany(
        riskWorkbook.name,
        companyId,
      );

    const allCnae = await this.uploadExcelProvider.getAllData({
      buffer,
      Workbook: riskWorkbook,
      read: readCnaes,
      DatabaseTable: riskDatabaseTable,
    });

    console.log('remove duplicates');

    const duplicates = removeDuplicate(allCnae, { removeById: 'code' });

    console.log('reduce');

    const arr = duplicates.reduce((acc, cnae, index) => {
      const i = Math.floor(index / 500);
      if (!acc[i]) acc[i] = [];
      acc[i].push(cnae);
      return acc;
    }, [] as any[]);

    console.log('start');

    await Promise.all(
      arr.map(async (data) => await this.activityRepository.upsertMany(data)),
    );

    console.log('done');

    return await this.uploadExcelProvider.newTableData({
      findAll: (sheet) =>
        findAllCnaes(this.excelProvider, this.activityRepository, sheet),
      Workbook: riskWorkbook,
      system,
      companyId,
      DatabaseTable: riskDatabaseTable,
    });
  }
}

const readCnaes = async (
  readFileData: IExcelReadData[],
  excelProvider: ExcelProvider,
  cnaeSheet: ICnaeSheet,
  databaseTable: DatabaseTableEntity,
) => {
  const cnaesTable = readFileData.find((data) => data.name === cnaeSheet.name);

  if (!cnaesTable)
    throw new BadRequestException(
      ErrorFilesEnum.WRONG_TABLE_SHEET.replace(
        '??FOUND??',
        readFileData.join(', '),
      ).replace('??EXPECTED??', cnaeSheet.name),
    );

  const cnaeDatabase = await excelProvider.transformToTableData(
    cnaesTable,
    cnaeSheet.columns,
  );

  if (databaseTable?.version && cnaeDatabase.version !== databaseTable.version)
    throw new BadRequestException(ErrorFilesEnum.WRONG_TABLE_VERSION);

  return cnaeDatabase.rows;
};
