import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';

import { HierarchyRoutes } from '@/@v2/enterprise/hierarchy/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditHierarchyUseCase } from '../use-cases/edit-hierarchy.usecase';
import { EditHierarchyPath } from './edit-hierarchy.path';
import { EditHierarchyPayload } from './edit-hierarchy.payload';

@Controller(HierarchyRoutes.HIERARCHY.PATH_ID)
@UseGuards(JwtAuthGuard)
export class EditHierarchyController {
  constructor(private readonly editHierarchyUseCase: EditHierarchyUseCase) {}

  @Patch()
  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: EditHierarchyPath, @Body() body: EditHierarchyPayload) {
    return this.editHierarchyUseCase.execute({
      companyId: path.companyId,
      id: path.hierarchyId,
      name: body.name,
      description: body.description,
      realDescription: body.realDescription,
      metadata: body.metadata,
    });
  }
}
