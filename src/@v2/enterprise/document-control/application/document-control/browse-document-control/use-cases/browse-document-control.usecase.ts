import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentControlDAO } from '../../../../database/dao/document-control/document-control.dao';
import { IDocumentControlUseCase } from './browse-document-control.types';

@Injectable()
export class BrowseDocumentControlUseCase {
  constructor(private readonly documentControlDAO: DocumentControlDAO) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControls = await this.documentControlDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        workspaceId: params.workspaceId,
        search: params.search,
      },
    });

    return documentControls;
  }
}
