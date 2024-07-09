import { Controller, Get, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindContactDto } from '../../dto/contact.dto';
import { FindWorkspaceService } from '../../services/workspace/find-workspace/find-workspace.service';
import { FindWorkspaceDto } from '../../dto/workspace.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly findWorkspaceService: FindWorkspaceService) {}

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
}
