import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';

import { DocumentControlRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditDocumentControlFileUseCase } from '../use-cases/edit-document-control-file.usecase';
import { EditDocumentControlFilePath } from './edit-document-control-file.path';
import { EditDocumentControlFilePayload } from './edit-document-control-file.payload';

@Controller(DocumentControlRoutes.DOCUMENT_CONTROL_FILE.PATH_ID)
@UseGuards(JwtAuthGuard)
export class EditDocumentControlFileController {
  constructor(private readonly EditDocumentControlFileUseCase: EditDocumentControlFileUseCase) {}

  @Patch()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: EditDocumentControlFilePath, @Body() body: EditDocumentControlFilePayload) {
    return this.EditDocumentControlFileUseCase.execute({
      companyId: path.companyId,
      documentControlFileId: path.documentControlFileId,
      description: body.description,
      fileId: body.fileId,
      endDate: body.endDate,
      startDate: body.startDate,
      name: body.name,
    });
  }
}
