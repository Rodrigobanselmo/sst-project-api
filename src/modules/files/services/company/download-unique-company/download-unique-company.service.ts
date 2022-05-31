import { Injectable } from '@nestjs/common';
import { WorkspaceRepository } from '../../../../../modules/company/repositories/implementations/WorkspaceRepository';
import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { DownloadExcelProvider } from '../../../../../modules/files/providers/donwlodExcelProvider';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';

import { findAllEmployees } from './../../../utils/findAllEmployees';

@Injectable()
export class DownloadUniqueCompanyService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly companyRepository: CompanyRepository,
    private readonly workspaceRepository: WorkspaceRepository,
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
          this.workspaceRepository,
          this.hierarchyRepository,
          sheet,
          companyId,
        ),
      Workbook,
      companyId,
    });
  }
}
