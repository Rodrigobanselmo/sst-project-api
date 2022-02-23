import { BadRequestException, Injectable } from '@nestjs/common';
import { RiskRepository } from 'src/modules/checklist/repositories/implementations/RiskRepository';
import { IRiskSheet } from 'src/shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from 'src/shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IExcelReadData } from 'src/shared/providers/ExcelProvider/models/IExcelProvider.types';
import { sortNumber } from 'src/shared/utils/sorts/number.sort';

import { DatabaseTableEntity } from '../../entities/databaseTable.entity';
import { DatabaseTableRepository } from '../../repositories/implementations/DatabaseTableRepository';
import { findAllRisks } from '../../utils/findAllRisks';

@Injectable()
export class UploadChecklistDataService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly riskRepository: RiskRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
  ) {}

  async execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    const riskWorkbook = workbooksConstant[WorkbooksEnum.RISK];

    const system = userPayloadDto.isMaster;
    const companyId = userPayloadDto.targetCompanyId;

    const readFileData = await this.excelProvider.read(buffer);

    // get risk table with actual version
    const riskDatabaseTable =
      await this.databaseTableRepository.findByNameAndCompany(
        riskWorkbook.name,
        companyId,
      );

    // read, validate and transform excel read response to rows and also check version
    const allRiskSeparatedArray = await Promise.all(
      Object.values(riskWorkbook.sheets).map(async (sheet) => {
        return await readRisks(
          readFileData,
          this.excelProvider,
          sheet,
          riskDatabaseTable,
        );
      }),
    );

    const allRisks = [];

    allRiskSeparatedArray.forEach((risks) => {
      allRisks.push(...risks);
    });

    // update or create all risks
    await this.riskRepository.upsertMany(allRisks, system, companyId);

    // get all user available risks to generate a new table
    const allRiskSheets = await Promise.all(
      Object.values(riskWorkbook.sheets)
        .sort((a, b) => sortNumber(a, b, 'id'))
        .map(async (sheet) => {
          return await findAllRisks(
            this.excelProvider,
            this.riskRepository,
            sheet,
            companyId,
          );
        }),
    );

    // create or update database table version
    const databaseTable = await this.databaseTableRepository.upsert(
      {
        name: riskWorkbook.name,
        companyId,
        version: riskDatabaseTable.version
          ? Number(riskDatabaseTable.version) + 1
          : 1,
      },
      companyId,
      system,
      riskDatabaseTable.id,
    );

    // create new table with new data
    const newExcelFile = await this.excelProvider.create({
      fileName: riskWorkbook.name,
      version: databaseTable.version,
      lastUpdate: new Date(databaseTable.updated_at),
      sheets: allRiskSheets,
    });

    return newExcelFile;
  }
}

const readRisks = async (
  readFileData: IExcelReadData[],
  excelProvider: ExcelProvider,
  riskSheet: IRiskSheet,
  databaseTable: DatabaseTableEntity,
) => {
  const risksTable = readFileData.find((data) => data.name === riskSheet.name);

  const riskDatabase = await excelProvider.transformToTableData(
    risksTable,
    riskSheet.columns,
  );

  if (databaseTable?.version && riskDatabase.version !== databaseTable.version)
    throw new BadRequestException(
      'The table you trying to insert has a different version, make sure you have the newest table version',
    );

  return riskDatabase.rows.map((risk) => ({ type: riskSheet.type, ...risk }));
};
