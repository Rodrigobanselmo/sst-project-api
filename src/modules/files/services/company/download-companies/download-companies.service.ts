import { Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/modules/company/repositories/implementations/CompanyRepository';
import { DownloadExcelProvider } from 'src/modules/files/providers/donwlodExcelProvider';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from 'src/shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';

import { findAllCompanies } from '../../../utils/findAllCompanies';

@Injectable()
export class DownloadCompaniesService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly companyRepository: CompanyRepository,
    private readonly downloadExcelProvider: DownloadExcelProvider,
  ) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const Workbook = workbooksConstant[WorkbooksEnum.COMPANIES];
    const companyId = userPayloadDto.companyId;

    return this.downloadExcelProvider.newTableData({
      findAll: (sheet) =>
        findAllCompanies(
          this.excelProvider,
          this.companyRepository,
          sheet,
          companyId,
          userPayloadDto.isMaster,
        ),
      Workbook,
      companyId,
    });
  }
}
