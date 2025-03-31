import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DocumentControlRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { AddDocumentControlFilePayload } from './add-document-control-file.payload';
import { AddDocumentControlFilePath } from './add-document-control-file.path';
import { AddDocumentControlFileUseCase } from '../use-cases/add-document-control-file.usecase';

@Controller(DocumentControlRoutes.DOCUMENT_CONTROL_FILE.PATH)
@UseGuards(JwtAuthGuard)
export class AddDocumentControlFileController {
  constructor(private readonly addDocumentControlFileUseCase: AddDocumentControlFileUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: AddDocumentControlFilePath, @Body() body: AddDocumentControlFilePayload) {
    return this.addDocumentControlFileUseCase.execute({
      companyId: path.companyId,
      documentControlId: path.documentControlId,
      description: body.description,
      fileId: body.fileId,
      endDate: body.endDate,
      startDate: body.startDate,
      name: body.name,
    });
  }
}
