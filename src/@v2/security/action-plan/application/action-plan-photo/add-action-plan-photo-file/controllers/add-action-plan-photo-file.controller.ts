import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { IMAGE_ALLOWED_TYPES, MAX_IMAGE_SIZE } from '@/@v2/shared/constants/files';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { createFileValidator } from '@/@v2/shared/utils/file/create-file-validator';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddActionPlanPhotoFileUseCase } from '../use-cases/add-action-plan-photo-file.usecase';
import { AddFilePath } from './add-action-plan-photo-file.path';
import { AddActionPlanPhotoPayload } from './add-action-plan-photo-file.payload';

@Controller(ActionPlanRoutes.ACTION_PLAN.PHOTO.ADD)
@UseGuards(JwtAuthGuard)
export class AddActionPlanPhotoFileController {
  constructor(private readonly addActionPlanPhotoFileUseCase: AddActionPlanPhotoFileUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(
    @UploadedFile(
      createFileValidator({
        maxSize: MAX_IMAGE_SIZE,
        fileType: IMAGE_ALLOWED_TYPES,
      }),
    )
    file: Express.Multer.File,
    @Param() path: AddFilePath,
    @Body() payload: AddActionPlanPhotoPayload,
  ) {
    return this.addActionPlanPhotoFileUseCase.execute({
      buffer: file.buffer,
      name: file.originalname,
      companyId: path.companyId,
      size: file.size,
      ...payload,
    });
  }
}
