import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DownloudClinicReportDto } from '../../dto/clinic-report.dto';
import { DownloudExpiredExamReportDto } from '../../dto/expired-exam-report.dto';
import { ClinicReportService } from '../../services/reports/clinic-report/clinic-report.service';
import { ExpiredExamReportService } from '../../services/reports/exam-report/expired-exam-report.service';

const getResponse = (res: Response, data: any) => {
  if ('workbook' in data) {
    res.attachment(data.filename);
    data.workbook.xlsx.write(res).then(function () {
      res.end();
    });
  } else {
    res.status(HttpStatus.OK).json(data);
  }
};

@Controller('files/report')
export class ReportsController {
  constructor(private readonly clinicReportService: ClinicReportService, private readonly expiredExamReportService: ExpiredExamReportService) {}

  @Permissions({ code: PermissionEnum.CLINIC, crud: true, isMember: true })
  @Post('/clinic/:companyId')
  async clinicReport(@Body() body: DownloudClinicReportDto, @User() userPayloadDto: UserPayloadDto, @Res() res: Response) {
    const data = await this.clinicReportService.execute(body, userPayloadDto);
    getResponse(res, data);
  }

  @Permissions({ code: PermissionEnum.EXAM, crud: true, isMember: true })
  @Post('/expired-exam/:companyId')
  async expiredExam(@Body() body: DownloudExpiredExamReportDto, @User() userPayloadDto: UserPayloadDto, @Res() res: Response) {
    const data = await this.expiredExamReportService.execute(body, userPayloadDto);
    getResponse(res, data);
  }
}
