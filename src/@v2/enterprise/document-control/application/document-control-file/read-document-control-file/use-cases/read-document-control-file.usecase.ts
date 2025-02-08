import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IDocumentControlUseCase } from './read-document-control-file.types';
import { DocumentControlFileDAO } from '@/@v2/enterprise/document-control/database/dao/document-control-file/document-control-file.dao';

@Injectable()
export class ReadDocumentControlFileUseCase {
  constructor(
    @Inject(SharedTokens.Storage) private readonly storage: IStorageAdapter,
    private readonly documentControlFileDAO: DocumentControlFileDAO,
  ) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControlFile = await this.documentControlFileDAO.read({
      id: params.documentControlFileId,
      companyId: params.companyId,
    });

    if (!documentControlFile) throw new BadRequestException('Documento não encontrado');

    const url = await this.storage.generateSignedPath({
      fileKey: documentControlFile.file.key,
      bucket: documentControlFile.file.bucket,
    });

    documentControlFile.file.url = url;

    return documentControlFile;
  }
}
