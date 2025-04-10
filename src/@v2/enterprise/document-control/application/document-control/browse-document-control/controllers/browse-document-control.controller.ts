import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/enterprise/document-control/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseDocumentControlUseCase } from '../use-cases/browse-document-control.usecase';
import { BrowseDocumentControlPath } from './browse-document-control.path';
import { BrowseDocumentControlQuery } from './browse-document-control.query';

@Controller(FormRoutes.DOCUMENT_CONTROL.PATH)
@UseGuards(JwtAuthGuard)
export class BrowseDocumentControlController {
  constructor(private readonly browseDocumentControlUseCase: BrowseDocumentControlUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseDocumentControlPath, @Query() query: BrowseDocumentControlQuery) {
    console.log('path', path);
    console.log('query', query);
    return this.browseDocumentControlUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      orderBy: query.orderBy,
      search: query.search,
      types: query.types,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
