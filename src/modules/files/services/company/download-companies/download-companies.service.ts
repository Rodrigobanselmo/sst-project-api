import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { DownloadExcelProvider } from '../../../../../modules/files/providers/donwlodExcelProvider';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';

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
        findAllCompanies(this.excelProvider, this.companyRepository, sheet, companyId, userPayloadDto.isMaster),
      Workbook,
      companyId,
    });
  }
}
