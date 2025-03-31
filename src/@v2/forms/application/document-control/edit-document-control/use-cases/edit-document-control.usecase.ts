import { DocumentControlRepository } from '@/@v2/enterprise/document-control/database/repositories/document-control/document-control.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IDocumentControlUseCase } from './edit-document-control.types';

@Injectable()
export class EditDocumentControlUseCase {
  constructor(private readonly documentControlRepository: DocumentControlRepository) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControlAggregate = await this.documentControlRepository.find({
      id: params.id,
      companyId: params.companyId,
    });

    if (!documentControlAggregate) throw new BadRequestException('Documento não encontrado');

    documentControlAggregate.update(params);

    await this.documentControlRepository.update(documentControlAggregate);
  }
}
