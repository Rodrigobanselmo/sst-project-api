import { Injectable } from '@nestjs/common';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { sortNumber } from '../../../shared/utils/sorts/number.sort';

import { DatabaseTableRepository } from '../repositories/implementations/DatabaseTableRepository';

@Injectable()
export class UploadExcelProvider {
  constructor(
    private readonly databaseTableRepository: DatabaseTableRepository,
    private readonly excelProvider: ExcelProvider,
  ) {}

  async getAllData({ buffer, Workbook, read, DatabaseTable }) {
    const readFileData = await this.excelProvider.read(buffer);

    // read, validate and transform excel read response to rows and also check version
    const allSeparatedArray = await Promise.all(
      Object.values(Workbook.sheets).map(async (sheet) => {
        return await read(
          readFileData,
          this.excelProvider,
          sheet,
          DatabaseTable,
        );
      }),
    );

    const allData = [];

    allSeparatedArray.forEach((data) => {
      allData.push(...data);
    });

    return allData;
  }

  async newTableData({ findAll, Workbook, system, companyId, DatabaseTable }) {
    // get all available data to generate a new table
    const allSheets = await Promise.all(
      Object.values(Workbook.sheets)
        .sort((a, b) => sortNumber(a, b, 'id'))
        .map(async (sheet) => {
          return await findAll(sheet);
        }),
    );

    // create or update database table version
    const databaseTable = await this.databaseTableRepository.upsert(
      {
        name: Workbook.name,
        companyId,
        version: DatabaseTable.version ? Number(DatabaseTable.version) + 1 : 1,
      },
      companyId,
      system,
      DatabaseTable.id,
    );

    // create new table with new data
    const newExcelFile = await this.excelProvider.create({
      fileName: Workbook.name,
      version: databaseTable.version,
      lastUpdate: new Date(databaseTable.updated_at),
      sheets: allSheets,
    });

    return newExcelFile;
  }
}
