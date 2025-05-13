import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditManyPhotoRecommendationUseCase } from '../use-cases/edit-many-photo-recommendation.usecase';
import { EditPhotoRecommendationPath } from './edit-many-photo-recommendation.path';
import { EditPhotoRecommendationPayload } from './edit-many-photo-recommendation.payload';
import { CharacterizationRoutes } from '@/@v2/security/characterization/constants/routes';

@Controller(CharacterizationRoutes.PHOTO_RECOMMENDATION.EDIT_MANY)
@UseGuards(JwtAuthGuard)
export class EditManyPhotoRecommendationController {
  constructor(private readonly editPhotoRecommendationUseCase: EditManyPhotoRecommendationUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditPhotoRecommendationPath, @Body() body: EditPhotoRecommendationPayload) {
    return this.editPhotoRecommendationUseCase.execute({
      companyId: path.companyId,
      ...body,
    });
  }
}
