import { Injectable } from '@nestjs/common';
import { RiskRepository } from 'src/modules/checklist/repositories/implementations/RiskRepository';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from 'src/shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';
import { sortNumber } from 'src/shared/utils/sorts/number.sort';

import { DatabaseTableRepository } from '../../repositories/implementations/DatabaseTableRepository';
import { findAllRisks } from '../../utils/findAllRisks';

@Injectable()
export class DownloadRiskDataService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly riskRepository: RiskRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
  ) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const riskWorkbook = workbooksConstant[WorkbooksEnum.RISK];
    const companyId = userPayloadDto.companyId;

    // get risk table with actual version
    const riskDatabaseTable =
      await this.databaseTableRepository.findByNameAndCompany(
        riskWorkbook.name,
        companyId,
      );

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

    // create new table with new data
    const newExcelWorkbook = await this.excelProvider.create({
      fileName: riskWorkbook.name,
      version: riskDatabaseTable.version,
      lastUpdate: new Date(riskDatabaseTable.updated_at),
      sheets: allRiskSheets,
    });

    return newExcelWorkbook;
  }
}
