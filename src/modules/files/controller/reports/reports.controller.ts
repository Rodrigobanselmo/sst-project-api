import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DownloadRiskStructureReportDto } from './../../dto/risk-structure-report.dto';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DownloudCharacterizationReportDto } from '../../dto/characterization-report.dto';
import { DownloudClinicReportDto } from '../../dto/clinic-report.dto';
import { DownloudDoneExamReportDto } from '../../dto/done-exam-report.dto copy';
import { DownloadEmployeeReportDto } from '../../dto/employee-report.dto';
import { DownloadExpiredExamReportDto } from '../../dto/expired-exam-report.dto';
import { CharacterizationReportService } from '../../services/reports/characterization-report/characterization-report.service';
import { ClinicReportService } from '../../services/reports/clinic-report/clinic-report.service';
import { DoneExamReportService } from '../../services/reports/done-exam-report/done-exam-report.service';
import { EmployeeReportService } from '../../services/reports/employee-report/employee-report.service';
import { ExamComplementaryReportService } from '../../services/reports/exam-complementary-report/exam-complementary-report.service';
import { ExpiredExamReportService } from '../../services/reports/expired-exam-report/expired-exam-report.service';
import { RiskStructureReportService } from '../../services/reports/risk-structure-report/risk-structure-report.service';

export const getResponse = (res: Response, data: any) => {
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
  constructor(
    private readonly clinicReportService: ClinicReportService,
    private readonly expiredExamReportService: ExpiredExamReportService,
    private readonly doneExamReportService: DoneExamReportService,
    private readonly riskStructureReportService: RiskStructureReportService,
    private readonly employeeReportService: EmployeeReportService,
    private readonly characterizationReportService: CharacterizationReportService,
    private readonly examComplementaryReportService: ExamComplementaryReportService,
  ) { }

  @Permissions({ code: PermissionEnum.CLINIC, crud: true, isMember: true })
  @Post('/clinic/:companyId')
  async clinicReport(
    @Body() body: DownloudClinicReportDto,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res: Response,
  ) {
    const data = await this.clinicReportService.execute(body, userPayloadDto);
    getResponse(res, data);
  }

  @Permissions({ code: PermissionEnum.CLINIC_SCHEDULE, crud: true, isMember: true })
  @Post('/expired-exam/:companyId')
  async expiredExam(
    @Body() body: DownloadExpiredExamReportDto,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res: Response,
  ) {
    const data = await this.expiredExamReportService.execute(body, userPayloadDto);
    getResponse(res, data);
  }

  @Permissions({ code: PermissionEnum.CLINIC_SCHEDULE, crud: true, isMember: true })
  @Post('/complementary-exam/:companyId')
  async complementaryExam(
    @Body() body: DownloadExpiredExamReportDto,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res: Response,
  ) {
    const data = await this.examComplementaryReportService.execute(body, userPayloadDto);
    getResponse(res, data);
  }

  @Permissions({ code: PermissionEnum.CLINIC_SCHEDULE, crud: true, isMember: true })
  @Post('/done-exam/:companyId')
  async doneExam(
    @Body() body: DownloudDoneExamReportDto,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res: Response,
  ) {
    const data = await this.doneExamReportService.execute(body, userPayloadDto);
    getResponse(res, data);
  }

  @Permissions({ code: PermissionEnum.RISK_DATA, crud: true, isMember: true })
  @Post('/risk-structure/:companyId')
  async riskStructure(
    @Body() body: DownloadRiskStructureReportDto,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res: Response,
  ) {
    const data = await this.riskStructureReportService.execute(body, userPayloadDto);
    getResponse(res, data);
  }

  @Permissions({ code: PermissionEnum.RISK_DATA, crud: true, isMember: true })
  @Post('/employee/:companyId')
  async employees(
    @Body() body: DownloadEmployeeReportDto,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res: Response,
  ) {
    const data = await this.employeeReportService.execute(body, userPayloadDto);
    getResponse(res, data);
  }

  @Permissions({ code: PermissionEnum.CHARACTERIZATION, crud: true, isMember: true })
  @Post('/characterization/:companyId')
  async addChar(
    @Body() body: DownloudCharacterizationReportDto,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res: Response,
  ) {
    const data = await this.characterizationReportService.execute(body, userPayloadDto);
    getResponse(res, data);
  }
}
