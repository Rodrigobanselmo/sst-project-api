import { DocumentControlFileRepository } from '@/@v2/enterprise/document-control/database/repositories/document-control-file/document-control-file.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IDocumentControlUseCase } from './delete-document-control-file.types';

@Injectable()
export class DeleteDocumentControlFileUseCase {
  constructor(private readonly documentControlFileRepository: DocumentControlFileRepository) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControlFile = await this.documentControlFileRepository.find({
      id: params.documentControlFileId,
      companyId: params.companyId,
    });

    if (!documentControlFile) throw new BadRequestException('Documento não encontrado');

    const isDeleted = await this.documentControlFileRepository.delete(documentControlFile);
    if (!isDeleted) throw new BadRequestException('Não foi possível deletar o documento');
  }
}
