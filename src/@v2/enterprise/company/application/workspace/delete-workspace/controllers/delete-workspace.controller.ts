import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { DeleteWorkspaceUseCase } from '../use-cases/delete-workspace.usecase';
import { DeleteWorkspacePath } from './delete-workspace.path';

@Controller(CompanyRoutes.WORKSPACE.DELETE)
@UseGuards(JwtAuthGuard)
export class DeleteWorkspaceController {
  constructor(private readonly deleteWorkspaceUseCase: DeleteWorkspaceUseCase) {}

  @Delete()
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: DeleteWorkspacePath) {
    return this.deleteWorkspaceUseCase.execute({
      workspaceId: path.workspaceId,
      companyId: path.companyId,
    });
  }
}
