import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  FindAccessGroupDto,
  UpsertAccessGroupDto,
} from '../../dto/access-group.dto';
import { FindAvailableAccessGroupsService } from '../../services/group/find-available-access-group/upsert-access-group.service';
import { UpsertAccessGroupsService } from '../../services/group/upsert-access-group/upsert-access-group.service';
import { User } from './../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from './../../../../shared/dto/user-payload.dto';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import {
  PermissionEnum,
  RoleEnum,
} from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';

@ApiTags('access-group')
@Controller('auth/group/:companyId')
export class AuthGroupController {
  constructor(
    private readonly findAvailableAccessGroupsService: FindAvailableAccessGroupsService,
    private readonly upsertAccessGroupsService: UpsertAccessGroupsService,
  ) {}

  @Permissions(
    {
      code: PermissionEnum.ACCESS_GROUP,
      crud: true,
      isMember: true,
    },
    {
      code: PermissionEnum.USER,
      crud: true,
      isMember: true,
    },
  )
  @Get()
  find(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindAccessGroupDto,
  ) {
    return this.findAvailableAccessGroupsService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.ACCESS_GROUP,
    crud: 'cu',
    isMember: true,
  })
  @Post()
  upsert(
    @Body() upsertAccessGroupDto: UpsertAccessGroupDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.upsertAccessGroupsService.execute(
      upsertAccessGroupDto,
      userPayloadDto,
    );
  }
}
