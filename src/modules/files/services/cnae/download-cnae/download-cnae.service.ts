import { Injectable } from '@nestjs/common';

import { findAllCnaes } from '../../../utils/findAllCnae';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { DownloadExcelProvider } from '../../../providers/donwlodExcelProvider';
import { ActivityRepository } from '../../../../company/repositories/implementations/ActivityRepository';

@Injectable()
export class DownloadCnaeService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly activityRepository: ActivityRepository,
    private readonly downloadExcelProvider: DownloadExcelProvider,
  ) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const Workbook = workbooksConstant[WorkbooksEnum.CNAE];
    const companyId = userPayloadDto.targetCompanyId;

    return this.downloadExcelProvider.newTableData({
      findAll: (sheet) => findAllCnaes(this.excelProvider, this.activityRepository, sheet),
      Workbook,
      companyId,
    });
  }
}
