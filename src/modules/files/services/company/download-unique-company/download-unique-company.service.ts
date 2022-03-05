import { Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/modules/company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from 'src/modules/company/repositories/implementations/HierarchyRepository';
import { DownloadExcelProvider } from 'src/modules/files/providers/donwlodExcelProvider';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from 'src/shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';

import { findAllEmployees } from './../../../utils/findAllEmployees';

@Injectable()
export class DownloadUniqueCompanyService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly companyRepository: CompanyRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly downloadExcelProvider: DownloadExcelProvider,
  ) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const Workbook = workbooksConstant[WorkbooksEnum.COMPANY];
    const companyId = userPayloadDto.companyId;

    return this.downloadExcelProvider.newTableData({
      findAll: (sheet) =>
        findAllEmployees(
          this.excelProvider,
          this.companyRepository,
          this.hierarchyRepository,
          sheet,
          companyId,
        ),
      Workbook,
      companyId,
    });
  }
}
