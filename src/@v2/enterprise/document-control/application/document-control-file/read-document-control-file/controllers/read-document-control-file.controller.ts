import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ReadDocumentControlFileUseCase } from '../use-cases/read-document-control-file.usecase';
import { ReadDocumentControlFilePath } from './read-document-control-file.path';

@Controller(FormRoutes.DOCUMENT_CONTROL_FILE.PATH_ID)
@UseGuards(JwtAuthGuard)
export class ReadDocumentControlFileController {
  constructor(private readonly readDocumentControlFileUseCase: ReadDocumentControlFileUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: ReadDocumentControlFilePath) {
    return this.readDocumentControlFileUseCase.execute({
      companyId: path.companyId,
      documentControlFileId: path.documentControlFileId,
    });
  }
}
