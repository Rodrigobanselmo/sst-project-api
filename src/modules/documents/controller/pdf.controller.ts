import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { PdfGuideDataService } from '../services/pdf/guide/guide-data.service';
import { PermissionEnum } from '../../../shared/constants/enum/authorization';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { PdfKitDataService } from '../services/pdf/kit/kit-data.service';
import { PdfProntuarioDataService } from '../services/pdf/prontuario/prontuario-data.service';
import { PdfAsoDataService } from '../services/pdf/aso/aso-data.service';
import { PdfOsDataService } from '../services/pdf/os/os-data.service';
import { PdfEvaluationDataService } from '../services/pdf/evaluation/evaluation-data.service';
import { KitPdfDto } from '../dto/kit-dto';
import { PdfVisitReportDataService } from '../services/pdf/visitReport/visit-report-data.service';
import { VisitReportPdfDto } from '../dto/visit-report-dto';
@Controller('documents/pdf')
export class DocumentsPdfController {
  constructor(
    private readonly pdfGuideDataService: PdfGuideDataService,
    private readonly pdfKitDataService: PdfKitDataService,
    private readonly pdfAsoDataService: PdfAsoDataService,
    private readonly pdfProntuarioDataService: PdfProntuarioDataService,
    private readonly pdfEvaluationDataService: PdfEvaluationDataService,
    private readonly pdfOsDataService: PdfOsDataService,
    private readonly pdfVisitReportDataService: PdfVisitReportDataService,
  ) {}

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isMember: true,
      isContract: true,
    },
  )
  @Get('guide/:employeeId/:companyId')
  async guide(@User() userPayloadDto: UserPayloadDto, @Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.pdfGuideDataService.execute(employeeId, userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isMember: true,
      isContract: true,
    },
  )
  @Get('aso/:employeeId/:companyId/:asoId?')
  async aso(
    @User() userPayloadDto: UserPayloadDto,
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('asoId') asoId: number,
  ) {
    return this.pdfAsoDataService.execute(employeeId, userPayloadDto, asoId ? Number(asoId) : asoId);
    // return this.pdfAsoDataService.execute(employeeId, userPayloadDto, { asoId: asoId ? Number(asoId) : asoId });
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isMember: true,
      isContract: true,
    },
  )
  @Get('prontuario/:employeeId/:companyId')
  async prontuario(@User() userPayloadDto: UserPayloadDto, @Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.pdfProntuarioDataService.execute(employeeId, userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isMember: true,
      isContract: true,
    },
  )
  @Get('prontuario-evaluation/:employeeId/:companyId')
  async evaluation(@User() userPayloadDto: UserPayloadDto, @Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.pdfEvaluationDataService.execute(employeeId, userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isMember: true,
      isContract: true,
    },
  )
  @Get('kit/:companyId')
  async kit(@User() userPayloadDto: UserPayloadDto, @Query() query: KitPdfDto) {
    return this.pdfKitDataService.execute(userPayloadDto, query);
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isMember: true,
      isContract: true,
    },
  )
  @Get('visit-report/:companyId')
  async visitReport(@User() userPayloadDto: UserPayloadDto, @Query() query: VisitReportPdfDto) {
    return this.pdfVisitReportDataService.execute(userPayloadDto, query);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isMember: true,
    isContract: true,
  })
  @Get('os/:employeeId/:companyId')
  async os(@User() userPayloadDto: UserPayloadDto, @Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.pdfOsDataService.execute(employeeId, userPayloadDto);
  }
}
