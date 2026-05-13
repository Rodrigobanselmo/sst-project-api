import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ReportDownloadTypeEnum } from '../../../dto/base-report.dto';
import { ReportEmployeeModelFactory } from '../../../factories/report/products/ReportEmployeeFactory';

@Injectable()
export class DownloadEmployeesService {
  constructor(
    private readonly reportEmployeeModelFactory: ReportEmployeeModelFactory,
  ) {}

  async execute(userPayloadDto: UserPayloadDto): Promise<{ workbook: Workbook; filename: string }> {
    const companyId = userPayloadDto.targetCompanyId;

    return this.reportEmployeeModelFactory.excelCompile(companyId, undefined);
  }
}
