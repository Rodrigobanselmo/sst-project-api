import { Controller, Delete, Get, Param, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindWorkspaceDto } from '../../dto/workspace.dto';
import { DeleteWorkspaceService } from '../../services/workspace/delete-workspace/delete-workspace.service';
import { FindWorkspaceService } from '../../services/workspace/find-workspace/find-workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(
    private readonly findWorkspaceService: FindWorkspaceService,
    private readonly deleteWorkspaceService: DeleteWorkspaceService,
  ) {}

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindWorkspaceDto) {
    return this.findWorkspaceService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete(':workspaceId')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('workspaceId') workspaceId: string) {
    return this.deleteWorkspaceService.execute(workspaceId, userPayloadDto);
  }
}
