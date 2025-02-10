import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DocumentControlRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { AddFilePath } from './add-document-control-system-file.path';
import { AddFileUseCase } from '../use-cases/add-document-control-system-file.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileValidator } from '@/@v2/shared/utils/file/create-file-validator';
import { ALLOWED_ALL_TYPES, MAX_DOCUMENT_SIZE } from '@/@v2/shared/constants/files';

@Controller(DocumentControlRoutes.FILE.PATH)
@UseGuards(JwtAuthGuard)
export class AddFileController {
  constructor(private readonly addFileUseCase: AddFileUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(
    @UploadedFile(
      createFileValidator({
        maxSize: MAX_DOCUMENT_SIZE,
        fileType: ALLOWED_ALL_TYPES,
      }),
    )
    file: Express.Multer.File,
    @Param() path: AddFilePath,
  ) {
    return this.addFileUseCase.execute({
      buffer: file.buffer,
      name: file.originalname,
      companyId: path.companyId,
    });
  }
}
