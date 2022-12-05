import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CompanyOSDto } from '../../dto/os.dto';
import { DeleteCompanyOSService } from '../../services/os/delete-os/delete-os.service';
import { FindOneCompanyOSService } from '../../services/os/find-os/find-os.service';
import { UpsertCompanyOSService } from '../../services/os/upsert-os/upsert-contact.service';

@ApiTags('os')
@Controller('company/:companyId/os')
export class CompanyOSController {
  constructor(
    private readonly upsertCompanyOSService: UpsertCompanyOSService,
    private readonly findOneCompanyOSService: FindOneCompanyOSService,
    private readonly deleteCompanyOSService: DeleteCompanyOSService,
  ) {}

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:id')
  find(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.findOneCompanyOSService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  upsert(@Body() body: CompanyOSDto, @User() userPayloadDto: UserPayloadDto) {
    return this.upsertCompanyOSService.execute(body, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteCompanyOSService.execute(id, userPayloadDto);
  }
}
