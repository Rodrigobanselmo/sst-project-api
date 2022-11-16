import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { DownloadExcelProvider } from '../../../providers/donwlodExcelProvider';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';

import { findAllEmployees } from '../../../utils/findAllEmployees';
import { WorkspaceRepository } from '../../../../../modules/company/repositories/implementations/WorkspaceRepository';

@Injectable()
export class DownloadEmployeesService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly companyRepository: CompanyRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly downloadExcelProvider: DownloadExcelProvider,
  ) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const Workbook = workbooksConstant[WorkbooksEnum.EMPLOYEES];
    const companyId = userPayloadDto.targetCompanyId;

    return this.downloadExcelProvider.newTableData({
      findAll: (sheet) => findAllEmployees(this.excelProvider, this.companyRepository, this.workspaceRepository, this.hierarchyRepository, sheet, companyId),
      Workbook,
      companyId,
    });
  }
}
