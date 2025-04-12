import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { DocumentControlRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DeleteDocumentControlFileUseCase } from '../use-cases/delete-document-control-file.usecase';
import { DeleteDocumentControlFilePath } from './delete-document-control-file.path';

@Controller(DocumentControlRoutes.DOCUMENT_CONTROL_FILE.PATH_ID)
@UseGuards(JwtAuthGuard)
export class DeleteDocumentControlFileController {
  constructor(private readonly DeleteDocumentControlFileUseCase: DeleteDocumentControlFileUseCase) {}

  @Delete()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: DeleteDocumentControlFilePath) {
    return this.DeleteDocumentControlFileUseCase.execute({
      companyId: path.companyId,
      documentControlFileId: path.documentControlFileId,
    });
  }
}
