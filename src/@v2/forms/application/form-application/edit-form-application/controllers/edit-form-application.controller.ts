import { Body, Controller, Param, Patch, Put, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditFormApplicationUseCase } from '../use-cases/edit-form-application.usecase';
import { EditFormApplicationPath } from './edit-form-application.path';
import { EditFormApplicationPayload } from './edit-form-application.payload';
import { FormApplicationCacheService } from '@/@v2/forms/services/form-application-cache.service';

@Controller(FormRoutes.FORM_APPLICATION.PATH_ID)
@UseGuards(JwtAuthGuard)
export class EditFormApplicationController {
  constructor(
    private readonly editFormApplicationUseCase: EditFormApplicationUseCase,
    private readonly formApplicationCacheService: FormApplicationCacheService,
  ) {}

  @Patch()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditFormApplicationPath, @Body() body: EditFormApplicationPayload) {
    const result = await this.editFormApplicationUseCase.execute({
      companyId: path.companyId,
      name: body.name,
      applicationId: path.applicationId,
      status: body.status,
      description: body.description,
      formId: body.formId,
      hierarchyIds: body.hierarchyIds,
      workspaceIds: body.workspaceIds,
      anonymous: body.anonymous,
      shareableLink: body.shareableLink,
      identifier: body.identifier,
      participationGoal: body.participationGoal,
    });

    // Invalidate cache after successful update
    await this.formApplicationCacheService.invalidateFormApplicationCache(path.applicationId);

    return result;
  }
}
