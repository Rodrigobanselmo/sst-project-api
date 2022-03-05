import { Injectable } from '@nestjs/common';
import { RiskRepository } from 'src/modules/checklist/repositories/implementations/RiskRepository';
import { DownloadExcelProvider } from 'src/modules/files/providers/donwlodExcelProvider';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from 'src/shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';

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
      findAll: (sheet) =>
        findAllRisks(this.excelProvider, this.riskRepository, sheet, companyId),
      Workbook,
      companyId,
    });
  }
}
