import { Injectable } from '@nestjs/common';
import { findAllHierarchies } from '../../../../../modules/files/utils/findAllHierarchies';

import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { WorkspaceRepository } from '../../../../company/repositories/implementations/WorkspaceRepository';
import { DownloadExcelProvider } from '../../../providers/donwlodExcelProvider';

@Injectable()
export class DownloadHierarchiesService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly companyRepository: CompanyRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly downloadExcelProvider: DownloadExcelProvider,
  ) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const Workbook = workbooksConstant[WorkbooksEnum.HIERARCHIES];
    const companyId = userPayloadDto.targetCompanyId;

    return this.downloadExcelProvider.newTableData({
      findAll: (sheet) => findAllHierarchies(this.excelProvider, this.hierarchyRepository, sheet, companyId),
      Workbook,
      companyId,
    });
  }
}
