import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  FindCompanyGroupDto,
  UpsertCompanyGroupDto,
} from '../../dto/company-group.dto';
import { FindAvailableCompanyGroupsService } from '../../services/group/find-company-groups-group/find-company-groups-group.service';
import { UpsertCompanyGroupsService } from '../../services/group/upsert-company-group/upsert-company-group.service';

import { User } from './../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from './../../../../shared/dto/user-payload.dto';

@ApiTags('company-group')
@Controller('company/:companyId/group')
export class CompanyGroupController {
  constructor(
    private readonly upsertCompanyGroupsService: UpsertCompanyGroupsService,
    private readonly findAvailableCompanyGroupsService: FindAvailableCompanyGroupsService,
  ) {}

  @Get()
  find(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindCompanyGroupDto,
  ) {
    return this.findAvailableCompanyGroupsService.execute(
      query,
      userPayloadDto,
    );
  }

  @Post()
  upsert(
    @Body() upsertAccessGroupDto: UpsertCompanyGroupDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.upsertCompanyGroupsService.execute(
      upsertAccessGroupDto,
      userPayloadDto,
    );
  }
}
