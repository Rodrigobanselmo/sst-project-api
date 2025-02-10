import { DocumentControlAggregateRepository } from '@/@v2/enterprise/document-control/database/repositories/document-control/document-control-aggregate.repository';
import { DocumentControlAggregate } from '@/@v2/enterprise/document-control/domain/aggregates/document-control.aggregate';
import { DocumentControlEntity } from '@/@v2/enterprise/document-control/domain/entities/document-control.entity';
import { GetDocumentControlFileService } from '@/@v2/enterprise/document-control/services/get-document-control-file/get-document-control-file.service';
import { Injectable } from '@nestjs/common';
import { IDocumentControlUseCase } from './add-document-control.types';

@Injectable()
export class AddDocumentControlUseCase {
  constructor(
    private readonly documentControlAggregateRepository: DocumentControlAggregateRepository,
    private readonly getDocumentControlService: GetDocumentControlFileService,
  ) {}

  async execute(params: IDocumentControlUseCase.Params) {
    const documentControlAggregate = this.createAggregate(params);

    if (params.file?.fileId) await this.addFile(params, documentControlAggregate);

    await this.documentControlAggregateRepository.create(documentControlAggregate);
  }

  private createAggregate(params: IDocumentControlUseCase.Params) {
    const documentControl = new DocumentControlEntity({
      name: params.name,
      companyId: params.companyId,
      type: params.type,
      description: params.description,
      workspaceId: params.workspaceId,
    });

    const documentControlAggregate = new DocumentControlAggregate({
      documentControl,
      files: [],
    });

    return documentControlAggregate;
  }

  private async addFile(params: IDocumentControlUseCase.Params, documentControl: DocumentControlAggregate) {
    const documentFile = await this.getDocumentControlService.get({
      companyId: params.companyId,
      documentControlId: documentControl.documentControl.id,
      endDate: params.file.endDate,
      startDate: params.file.startDate,
      fileId: params.file.fileId,
    });

    if (params.file?.name) documentFile.name = params.file.name;

    documentControl.addFile(documentFile);
  }
}
