import { Injectable } from '@nestjs/common';
import { RiskRepository } from '../../../../sst/repositories/implementations/RiskRepository';
import { DownloadExcelProvider } from '../../../../../modules/files/providers/donwlodExcelProvider';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';

import { findAllRisks } from '../../../utils/findAllRisks';

@Injectable()
export class DownloadRiskDataService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly riskRepository: RiskRepository,
    private readonly downloadExcelProvider: DownloadExcelProvider,
  ) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const Workbook = workbooksConstant[WorkbooksEnum.RISK];
    const companyId = userPayloadDto.companyId;

    return this.downloadExcelProvider.newTableData({
      findAll: (sheet) => findAllRisks(this.excelProvider, this.riskRepository, sheet, companyId),
      Workbook,
      companyId,
    });
  }
}
