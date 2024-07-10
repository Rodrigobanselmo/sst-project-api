import { findAllCids } from './../../../utils/findAllCids';
import { ErrorFilesEnum } from '../../../../../shared/constants/enum/errorMessage';
import { CidRepository } from '../../../../company/repositories/implementations/CidRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ICidSheet } from '../../../../../shared/constants/workbooks/sheets/cid/cidSheet.constant';
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
export class UploadCidDataService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly cidRepo: CidRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
    private readonly uploadExcelProvider: UploadExcelProvider,
  ) {}

  async execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    const riskWorkbook = workbooksConstant[WorkbooksEnum.CID];

    const system = userPayloadDto.isSystem;
    const companyId = userPayloadDto.targetCompanyId;

    // get risk table with actual version
    const riskDatabaseTable = await this.databaseTableRepository.findByNameAndCompany(riskWorkbook.name, companyId);

    const allCid = await this.uploadExcelProvider.getAllData({
      buffer,
      Workbook: riskWorkbook,
      read: readCids,
      DatabaseTable: riskDatabaseTable,
    });

    console.info('remove duplicates');

    const duplicates = removeDuplicate(allCid, { removeById: 'code' });

    console.info('reduce');

    const arr = duplicates.reduce((acc, cid, index) => {
      const i = Math.floor(index / 500);
      if (!acc[i]) acc[i] = [];
      acc[i].push(cid);
      return acc;
    }, [] as any[]);

    console.info('start');

    await Promise.all(arr.map(async (data) => await this.cidRepo.upsertMany(data)));

    console.info('done');

    return await this.uploadExcelProvider.newTableData({
      findAll: (sheet) => findAllCids(this.excelProvider, this.cidRepo, sheet),
      Workbook: riskWorkbook,
      system,
      companyId,
      DatabaseTable: riskDatabaseTable,
    });
  }
}

const readCids = async (
  readFileData: IExcelReadData[],
  excelProvider: ExcelProvider,
  cidSheet: ICidSheet,
  databaseTable: DatabaseTableEntity,
) => {
  const cidsTable = readFileData.find((data) => data.name === cidSheet.name);

  if (!cidsTable)
    throw new BadRequestException(
      ErrorFilesEnum.WRONG_TABLE_SHEET.replace('??FOUND??', readFileData.join(', ')).replace(
        '??EXPECTED??',
        cidSheet.name,
      ),
    );

  const cidDatabase = await excelProvider.transformToTableData(cidsTable, cidSheet.columns);

  if (databaseTable?.version && cidDatabase.version !== databaseTable.version)
    throw new BadRequestException(ErrorFilesEnum.WRONG_TABLE_VERSION);

  return cidDatabase.rows;
};
