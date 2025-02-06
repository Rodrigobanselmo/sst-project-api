import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { DocumentControlRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DeleteDocumentControlUseCase } from '../use-cases/delete-document-control.usecase';
import { DeleteDocumentControlFilePath } from './delete-document-control-file.path';

@Controller(DocumentControlRoutes.DOCUMENT_CONTROL.PATH_ID)
@UseGuards(JwtAuthGuard)
export class DeleteDocumentControlController {
  constructor(private readonly deleteDocumentControlUseCase: DeleteDocumentControlUseCase) {}

  @Delete()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: DeleteDocumentControlFilePath) {
    return this.deleteDocumentControlUseCase.execute({
      companyId: path.companyId,
      documentControlId: path.documentControlId,
    });
  }
}
