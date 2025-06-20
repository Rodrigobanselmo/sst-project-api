import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { Inject, Injectable } from '@nestjs/common';
import { DocumentControlDAO } from '../../../../database/dao/document-control/document-control.dao';
import { IDocumentControlUseCase } from './browse-document-control.types';

@Injectable()
export class BrowseDocumentControlUseCase {
  constructor(
    @Inject(SharedTokens.Storage) private readonly storage: IStorageAdapter,
    private readonly documentControlDAO: DocumentControlDAO,
  ) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControls = await this.documentControlDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        types: params.types,
        companyId: params.companyId,
        workspaceId: params.workspaceId,
        search: params.search,
      },
    });

    await asyncBatch({
      items: documentControls.results,
      batchSize: 15,
      callback: async (documentControl) => {
        if (!documentControl.file) return;

        const url = await this.storage.generateSignedPath({
          fileKey: documentControl.file.key,
          bucket: documentControl.file.bucket,
        });

        documentControl.file.url = url;
      },
    });

    return documentControls;
  }
}
