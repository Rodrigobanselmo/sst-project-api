import { Injectable } from '@nestjs/common';
import { ReportDownloadtypeEnum } from 'src/modules/files/dto/base-report.dto';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ReportClinicFactory } from '../../../factories/report/products/ReportClinicFactory';
import { DownloudClinicReportDto } from './../../../dto/clinic-report.dto';

@Injectable()
export class ClinicReportService {
  constructor(private readonly excelProvider: ExcelProvider, private readonly reportClinicFactory: ReportClinicFactory) {}

  async execute(body: DownloudClinicReportDto, userPayloadDto: UserPayloadDto) {
    const downloadType = body.downloadType;
    delete body.downloadType;

    if (!downloadType || downloadType == ReportDownloadtypeEnum.XML) {
      const excelFile = await this.reportClinicFactory.excelCompile(userPayloadDto.targetCompanyId, body);
      return excelFile;
    } else {
      const rows = await this.reportClinicFactory.getRows(userPayloadDto.targetCompanyId, body);
      return rows;
    }
  }
}
