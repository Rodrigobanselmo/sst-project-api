import { DocumentControlDAO } from './../../../../database/dao/document-control/document-control.dao';
import { DocumentControlRepository } from '@/@v2/enterprise/document-control/database/repositories/document-control/document-control.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IDocumentControlUseCase } from './read-document-control.types';

@Injectable()
export class ReadDocumentControlUseCase {
  constructor(private readonly documentControlDAO: DocumentControlDAO) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControl = await this.documentControlDAO.read({
      id: params.documentControlId,
      companyId: params.companyId,
    });

    if (!documentControl) throw new BadRequestException('Documento não encontrado');

    return documentControl;
  }
}
