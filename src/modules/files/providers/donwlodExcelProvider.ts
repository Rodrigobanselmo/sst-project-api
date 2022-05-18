import { Injectable } from '@nestjs/common';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { sortNumber } from '../../../shared/utils/sorts/number.sort';

import { DatabaseTableRepository } from '../repositories/implementations/DatabaseTableRepository';

@Injectable()
export class DownloadExcelProvider {
  constructor(
    private readonly databaseTableRepository: DatabaseTableRepository,
    private readonly excelProvider: ExcelProvider,
  ) {}

  async newTableData({ findAll, Workbook, companyId }) {
    // get risk table with actual version
    const databaseTable =
      await this.databaseTableRepository.findByNameAndCompany(
        Workbook.name,
        companyId,
      );

    // get all available data to generate a new table
    const allSheets = await Promise.all(
      Object.values(Workbook.sheets)
        .sort((a, b) => sortNumber(a, b, 'id'))
        .map(async (sheet) => {
          return await findAll(sheet);
        }),
    );

    // create new table with new data
    const newExcelFile = await this.excelProvider.create(
      {
        fileName: Workbook.name,
        version: databaseTable.version,
        lastUpdate: new Date(databaseTable.updated_at),
        sheets: allSheets,
      },
      companyId,
    );

    return newExcelFile;
  }
}
