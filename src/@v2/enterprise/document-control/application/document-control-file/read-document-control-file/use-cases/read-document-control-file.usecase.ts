import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentControlDAO as DocumentControlFileDAO } from '../../../../database/dao/document-control/document-control.dao';
import { IDocumentControlUseCase } from './read-document-control-file.types';

@Injectable()
export class ReadDocumentControlFileUseCase {
  constructor(private readonly documentControlFileDAO: DocumentControlFileDAO) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControlFile = await this.documentControlFileDAO.read({
      id: params.documentControlFileId,
      companyId: params.companyId,
    });

    if (!documentControlFile) throw new BadRequestException('Documento não encontrado');

    return documentControlFile;
  }
}
