import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadRoutes } from '../../../constants/routes';
import { UploadStructureUseCase } from '../use-cases/upload-structure.usecase';
import { UploadStructurePath } from './upload-structure.path';
import { UploadStructurePayload } from './upload-structure.payload';
import { createFileValidator } from '@/@v2/shared/utils/file/create-file-validator';
import { ALLOWED_ALL_TYPES, ALLOWED_UPLOAD_XML_TYPES, MAX_DOCUMENT_SIZE } from '@/@v2/shared/constants/files';

@Controller(UploadRoutes.UPLOAD_STRUCTURE.PATH)
@UseGuards(JwtAuthGuard)
export class UploadStructureController {
  constructor(private readonly uploadStructureUseCase: UploadStructureUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  async add(
    @Param() path: UploadStructurePath,
    @Body() body: UploadStructurePayload,
    @UploadedFile(
      createFileValidator({
        maxSize: MAX_DOCUMENT_SIZE,
        fileType: ALLOWED_UPLOAD_XML_TYPES,
        required: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadStructureUseCase.execute({
      companyId: path.companyId,
      buffer: file.buffer,
      createHierarchyIfNotExists: body.createHierarchyIfNotExists,
      createHomogeneousGroupIfNotExists: body.createHomogeneousGroupIfNotExists,
      createEmployeeIfNotExists: body.createEmployeeIfNotExists,
      linkHierarchyToHomogeneousGroupIfNotExists: body.linkHierarchyToHomogeneousGroupIfNotExists,
      stopOnFirstError: body.stopOnFirstError,
    });
  }
}
