import { DownloudClinicReportDto } from './../../../dto/clinic-report.dto';
import { ReportClinicFactory } from '../../../factories/report/products/ReportClinicFactory';
import { Injectable } from '@nestjs/common';
import { RiskRepository } from '../../../../sst/repositories/implementations/RiskRepository';
import { DownloadExcelProvider } from '../../../providers/donwlodExcelProvider';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';

import { findAllRisks } from '../../../utils/findAllRisks';

@Injectable()
export class ClinicReportService {
  constructor(private readonly excelProvider: ExcelProvider, private readonly reportClinicFactory: ReportClinicFactory) {}

  async execute(query: DownloudClinicReportDto, userPayloadDto: UserPayloadDto) {
    if (query.isXml) {
      const excelFile = await this.reportClinicFactory.excelCompile();
      return excelFile;
    } else {
      const rows = await this.reportClinicFactory.getRows();
      return rows;
    }
  }
}
