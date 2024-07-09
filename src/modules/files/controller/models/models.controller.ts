import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { ReportDownloadTypeEnum } from '../../dto/base-report.dto';
import { DownaldEmployeeModelFactory } from '../../factories/report/products/DownaldEmployeeModelFactory';
import { DownaldRiskModelFactory } from '../../factories/report/products/DownaldRiskModelFactory';
import { getResponse } from '../reports/reports.controller';

//! downaload /risk-structure and employee with workspace dinamicly for one or more

@Controller('files/models')
export class ModelsUploadsController {
  constructor(
    private readonly downaldRiskModelFactory: DownaldRiskModelFactory,
    private readonly downaldEmpoyeeModelFactory: DownaldEmployeeModelFactory,
  ) {}

  @Post('/employee/:companyId')
  async employeeModel(@User() userPayloadDto: UserPayloadDto, @Res() res: Response) {
    const data = await this.downaldEmpoyeeModelFactory.execute({
      downloadType: ReportDownloadTypeEnum.XML,
      companyId: userPayloadDto.targetCompanyId,
    });
    getResponse(res, data);
  }

  @Post('/risk/:companyId')
  async riskStructure(@User() userPayloadDto: UserPayloadDto, @Res() res: Response) {
    const data = await this.downaldRiskModelFactory.execute({
      downloadType: ReportDownloadTypeEnum.XML,
      companyId: userPayloadDto.targetCompanyId,
    });
    getResponse(res, data);
  }
}
