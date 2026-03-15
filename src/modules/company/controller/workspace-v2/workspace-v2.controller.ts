import { Controller, Delete, Param } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DeleteWorkspaceService } from '../../services/workspace/delete-workspace/delete-workspace.service';

/**
 * Controller que expõe a rota v2 para exclusão lógica de estabelecimento.
 * Path exato chamado pelo client: DELETE /v2/companies/:companyId/workspaces/:workspaceId
 */
@Controller('v2/companies/:companyId/workspaces')
export class WorkspaceV2Controller {
  constructor(private readonly deleteWorkspaceService: DeleteWorkspaceService) {}

  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete(':workspaceId')
  delete(
    @Param('workspaceId') workspaceId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.deleteWorkspaceService.execute(workspaceId, userPayloadDto);
  }
}
