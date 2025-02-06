import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { DocumentControlRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ReadDocumentControlUseCase } from '../use-cases/read-document-control.usecase';
import { ReadDocumentControlPath } from './read-document-control.path';

@Controller(DocumentControlRoutes.DOCUMENT_CONTROL.PATH_ID)
@UseGuards(JwtAuthGuard)
export class ReadDocumentControlController {
  constructor(private readonly readDocumentControlUseCase: ReadDocumentControlUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: ReadDocumentControlPath) {
    return this.readDocumentControlUseCase.execute({
      companyId: path.companyId,
      documentControlId: path.documentControlId,
    });
  }
}
