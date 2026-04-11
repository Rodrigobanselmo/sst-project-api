import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { HierarchyGroupApplicationPath, HierarchyGroupIdPath } from './hierarchy-group.path';
import { BrowseHierarchyGroupsUseCase } from './browse-hierarchy-groups/use-cases/browse-hierarchy-groups.usecase';
import { UpsertHierarchyGroupsUseCase } from './upsert-hierarchy-groups/use-cases/upsert-hierarchy-groups.usecase';
import { UpsertHierarchyGroupsBody } from './upsert-hierarchy-groups/controllers/upsert-hierarchy-groups.body';
import { DeleteHierarchyGroupUseCase } from './delete-hierarchy-group/use-cases/delete-hierarchy-group.usecase';

@Controller(FormRoutes.HIERARCHY_GROUP.PATH)
@UseGuards(JwtAuthGuard)
export class HierarchyGroupController {
  constructor(
    private readonly browseUseCase: BrowseHierarchyGroupsUseCase,
    private readonly upsertUseCase: UpsertHierarchyGroupsUseCase,
    private readonly deleteUseCase: DeleteHierarchyGroupUseCase,
  ) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  browse(@Param() path: HierarchyGroupApplicationPath) {
    return this.browseUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
    });
  }

  @Put()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  upsert(@Param() path: HierarchyGroupApplicationPath, @Body() body: UpsertHierarchyGroupsBody) {
    return this.upsertUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
      groups: body.groups,
    });
  }

  @Delete(':groupId')
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  remove(@Param() path: HierarchyGroupIdPath) {
    return this.deleteUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
      groupId: path.groupId,
    });
  }
}
