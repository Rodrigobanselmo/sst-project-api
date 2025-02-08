import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DocumentControlDAO } from '../../../../database/dao/document-control/document-control.dao';
import { IDocumentControlUseCase } from './browse-document-control.types';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';

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
        companyId: params.companyId,
        workspaceId: params.workspaceId,
        search: params.search,
      },
    });

    await asyncBatch({
      items: documentControls.results,
      batchSize: 15,
      callback: async (documentControl) => {
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
