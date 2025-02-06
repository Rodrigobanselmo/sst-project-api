import { DocumentControlFileRepository } from '@/@v2/enterprise/document-control/database/repositories/document-control-file/document-control-file.repository';
import { DocumentControlRepository } from '@/@v2/enterprise/document-control/database/repositories/document-control/document-control.repository';
import { GetDocumentControlFileService } from '@/@v2/enterprise/document-control/services/get-document-control-file/get-document-control-file.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IDocumentControlUseCase } from './add-document-control-file.types';

@Injectable()
export class AddDocumentControlFileUseCase {
  constructor(
    private readonly documentControlRepository: DocumentControlRepository,
    private readonly documentControlFileRepository: DocumentControlFileRepository,
    private readonly getDocumentControlService: GetDocumentControlFileService,
  ) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControl = this.documentControlRepository.find({
      id: params.documentControlId,
      companyId: params.companyId,
    });

    if (!documentControl) throw new BadRequestException('Documento não encontrado');

    const documentFile = await this.getDocumentControlService.get({
      companyId: params.companyId,
      documentControlId: params.documentControlId,
      endDate: params.endDate,
      startDate: params.startDate,
      fileId: params.fileId,
    });

    if (params.name) documentFile.name = params.name;

    await this.documentControlFileRepository.create(documentFile);
  }
}
