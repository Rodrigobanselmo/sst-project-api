import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DocumentControlRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { AddDocumentControlPayload } from './add-document-control.payload';
import { AddDocumentControlPath } from './add-document-control.path';
import { AddDocumentControlUseCase } from '../use-cases/add-document-control.usecase';

@Controller(DocumentControlRoutes.DOCUMENT_CONTROL.PATH)
@UseGuards(JwtAuthGuard)
export class AddDocumentControlController {
  constructor(private readonly addDocumentControlUseCase: AddDocumentControlUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: AddDocumentControlPath, @Body() body: AddDocumentControlPayload) {
    return this.addDocumentControlUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      ...body,
    });
  }
}
