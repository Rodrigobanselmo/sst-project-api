import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { PdfGuideDataService } from '../services/pdf/guide/guide-data.service';
import { PermissionEnum } from '../../../shared/constants/enum/authorization';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
@Controller('documents/pdf')
export class DocumentsPdfController {
  constructor(private readonly pdfGuideDataService: PdfGuideDataService) {}

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
}
