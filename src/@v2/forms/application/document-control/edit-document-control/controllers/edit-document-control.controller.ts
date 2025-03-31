import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DocumentControlRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { EditDocumentControlPayload } from './edit-document-control.payload';
import { EditDocumentControlPath } from './edit-document-control.path';
import { EditDocumentControlUseCase } from '../use-cases/edit-document-control.usecase';

@Controller(DocumentControlRoutes.DOCUMENT_CONTROL.PATH_ID)
@UseGuards(JwtAuthGuard)
export class EditDocumentControlController {
  constructor(private readonly EditDocumentControlUseCase: EditDocumentControlUseCase) {}

  @Patch()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: EditDocumentControlPath, @Body() body: EditDocumentControlPayload) {
    return this.EditDocumentControlUseCase.execute({
      companyId: path.companyId,
      description: body.description,
      name: body.name,
      id: path.documentControlId,
      type: body.type,
    });
  }
}
