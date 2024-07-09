import { Controller, Get, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { SyncDto } from '../../dto/sync.dto';
import { SyncMainService } from '../../services/sync/sync-main/sync-main.service';
import { SyncHierarchyService } from '../../services/sync/sync-hierarchy/sync-hierarchy.service';

@Controller('sync')
export class SyncController {
  constructor(
    private readonly syncService: SyncMainService,
    private readonly syncHierarchyService: SyncHierarchyService,
  ) {}

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get()
  sync(@Query() query: SyncDto, @User() userPayloadDto: UserPayloadDto) {
    return this.syncService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('hierarchy')
  syncHierarchy(@Query() query: SyncDto, @User() userPayloadDto: UserPayloadDto) {
    return this.syncHierarchyService.execute(query, userPayloadDto);
  }
}
