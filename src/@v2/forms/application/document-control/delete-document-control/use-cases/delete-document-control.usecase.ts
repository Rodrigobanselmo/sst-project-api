import { DocumentControlRepository } from '@/@v2/enterprise/document-control/database/repositories/document-control/document-control.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IDocumentControlUseCase } from './delete-document-control.types';

@Injectable()
export class DeleteDocumentControlUseCase {
  constructor(private readonly documentControlRepository: DocumentControlRepository) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControlFile = await this.documentControlRepository.find({
      id: params.documentControlId,
      companyId: params.companyId,
    });

    if (!documentControlFile) throw new BadRequestException('Documento não encontrado');

    const isDeleted = await this.documentControlRepository.delete(documentControlFile);
    if (!isDeleted) throw new BadRequestException('Não foi possível deletar o documento');
  }
}
