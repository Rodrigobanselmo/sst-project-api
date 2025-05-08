import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DocumentControlDAO } from './../../../../database/dao/document-control/document-control.dao';
import { IDocumentControlUseCase } from './read-document-control.types';

@Injectable()
export class ReadDocumentControlUseCase {
  constructor(
    @Inject(SharedTokens.Storage) private readonly storage: IStorageAdapter,
    private readonly documentControlDAO: DocumentControlDAO,
  ) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControl = await this.documentControlDAO.read({
      id: params.documentControlId,
      companyId: params.companyId,
    });

    if (!documentControl) throw new BadRequestException('Documento não encontrado');

    await asyncBatch({
      items: documentControl.files,
      batchSize: 15,
      callback: async (documentControlFile) => {
        if (!documentControlFile.file) return;

        const url = await this.storage.generateSignedPath({
          fileKey: documentControlFile.file.key,
          bucket: documentControlFile.file.bucket,
        });

        documentControlFile.file.url = url;
      },
    });

    return documentControl;
  }
}
