import { Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/modules/company/repositories/implementations/CompanyRepository';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from 'src/shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';
import { sortString } from 'src/shared/utils/sorts/string.sort';

import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
import { findAllCompanies } from '../../../utils/findAllCompanies';

@Injectable()
export class DownloadCompaniesService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly companyRepository: CompanyRepository,
    private readonly databaseTableRepository: DatabaseTableRepository,
  ) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const Workbook = workbooksConstant[WorkbooksEnum.COMPANIES];
    const companyId = userPayloadDto.companyId;

    // get risk table with actual version
    const databaseTable =
      await this.databaseTableRepository.findByNameAndCompany(
        Workbook.name,
        companyId,
      );

    // get all user available risks to generate a new table
    const allSheets = await Promise.all(
      Object.values(Workbook.sheets)
        .sort((a, b) => sortString(a, b, 'id'))
        .map(async (sheet) => {
          return await findAllCompanies(
            this.excelProvider,
            this.companyRepository,
            sheet,
            companyId,
            userPayloadDto.isMaster,
          );
        }),
    );

    // create new table with new data
    const newExcelWorkbook = await this.excelProvider.create({
      fileName: Workbook.name,
      version: databaseTable.version,
      lastUpdate: new Date(databaseTable.updated_at),
      sheets: allSheets,
    });

    return newExcelWorkbook;
  }
}
