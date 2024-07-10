import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindCompanyGroupDto, UpsertCompanyGroupDto } from '../../dto/company-group.dto';
import { FindAvailableCompanyGroupsService } from '../../services/group/find-company-groups-group/find-company-groups-group.service';
import { UpsertCompanyGroupsService } from '../../services/group/upsert-company-group/upsert-company-group.service';

import { User } from './../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from './../../../../shared/dto/user-payload.dto';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
@Controller('company/:companyId/group')
export class CompanyGroupController {
  constructor(
    private readonly upsertCompanyGroupsService: UpsertCompanyGroupsService,
    private readonly findAvailableCompanyGroupsService: FindAvailableCompanyGroupsService,
  ) {}

  @Roles(RoleEnum.COMPANY, RoleEnum.CONTRACTS, RoleEnum.USER)
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindCompanyGroupDto) {
    return this.findAvailableCompanyGroupsService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY_GROUPS,
    isContract: true,
    isMember: true,
  })
  @Post()
  upsert(@Body() upsertAccessGroupDto: UpsertCompanyGroupDto, @User() userPayloadDto: UserPayloadDto) {
    return this.upsertCompanyGroupsService.execute(upsertAccessGroupDto, userPayloadDto);
  }
}
