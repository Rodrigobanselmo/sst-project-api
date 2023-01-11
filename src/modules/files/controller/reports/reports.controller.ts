import { Controller, Get, HttpStatus, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DownloadCidService } from '../../services/cid/download-cid/download-cid.service';
import { UploadCidDataService } from '../../services/cid/upload-cid/upload-cid.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { ClinicReportService } from '../../services/reports/clinic-report/clinic-report.service';
import { DownloudClinicReportDto } from '../../dto/clinic-report.dto';
import { Response } from 'express';

@Controller('files/report')
export class ReportsController {
  constructor(private readonly clinicReportService: ClinicReportService) {}

  // @Permissions({ code: PermissionEnum.CLINIC, crud: true, isMember: true })
  @Get('/clinic/:companyId')
  async download(@Query() query: DownloudClinicReportDto, @User() userPayloadDto: UserPayloadDto, @Res() res: Response) {
    const data = await this.clinicReportService.execute(query, userPayloadDto);

    if ('workbook' in data) {
      res.attachment(data.filename);
      data.workbook.xlsx.write(res).then(function () {
        res.end();
      });
    } else {
      res.status(HttpStatus.OK).json(data);
    }
    // const { workbook, filename } = await this.clinicReportService.execute(query, userPayloadDto);
  }
}
