import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { ListHierarchyTypesUseCase } from '../use-cases/list-hierarchy-types.usecase'
import { ListHierarchyTypesPath } from './list-hierarchy-types.path'
import { ListHierarchyTypesQuery } from './list-hierarchy-types.query'
import { HierarchyRoutes } from '@/@v2/enterprise/hierarchy/constants/routes'

@Controller(HierarchyRoutes.HIERARCHY.LIST_TYPES)
@UseGuards(JwtAuthGuard)
export class ListHierarchyTypesController {
  constructor(
    private readonly listHierarchyTypesUseCase: ListHierarchyTypesUseCase
  ) { }

  @Get()
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: ListHierarchyTypesPath, @Query() query: ListHierarchyTypesQuery) {
    return this.listHierarchyTypesUseCase.execute({
      companyId: path.companyId,
      workspaceId: query.workspaceId,
    })
  }
}
