import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { PdfGuideDataService } from '../services/pdf/guide/guide-data.service';
import { PermissionEnum } from '../../../shared/constants/enum/authorization';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { PdfKitDataService } from '../services/pdf/kit/kit-data.service';
import { PdfProntuarioDataService } from '../services/pdf/prontuario/prontuario-data.service';
import { PdfAsoDataService } from '../services/pdf/aso/aso-data.service';
import { PdfOsDataService } from '../services/pdf/os/os-data.service';
@Controller('documents/pdf')
export class DocumentsPdfController {
  constructor(
    private readonly pdfGuideDataService: PdfGuideDataService,
    private readonly pdfKitDataService: PdfKitDataService,
    private readonly pdfAsoDataService: PdfAsoDataService,
    private readonly pdfProntuarioDataService: PdfProntuarioDataService,
    private readonly pdfOsDataService: PdfOsDataService,
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
  async aso(@User() userPayloadDto: UserPayloadDto, @Param('employeeId', ParseIntPipe) employeeId: number, @Param('asoId') asoId: number) {
    return this.pdfAsoDataService.execute(employeeId, userPayloadDto, asoId ? Number(asoId) : asoId);
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
  @Get('kit/:employeeId/:companyId/:asoId?')
  async kit(@User() userPayloadDto: UserPayloadDto, @Param('employeeId', ParseIntPipe) employeeId: number, @Param('asoId') asoId: number) {
    return this.pdfKitDataService.execute(employeeId, userPayloadDto, asoId ? Number(asoId) : asoId);
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
