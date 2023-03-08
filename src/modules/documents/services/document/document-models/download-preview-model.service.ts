import { modelCompanyId, modelDocumentDataId, modelWorkspaceId } from './../../../../../shared/constants/ids';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

import { DownloadPreviewModelData } from '../../../dto/document-model.dto';
import { DocumentPGRPreviewFactory } from '../../../factories/document/products/PGR/DocumentPGRPreviewFactory';

@Injectable()
export class DownloadPreviewModel {
  constructor(private readonly documentPGRPreviewFactory: DocumentPGRPreviewFactory) {}
  async execute(body: DownloadPreviewModelData, user: UserPayloadDto) {
    return await this.documentPGRPreviewFactory.execute({
      workspaceName: '{{Nome Estabelecimento}}',
      name: 'Prévia',
      version: '0.0.0',
      description: 'Prévia',
      type: body.type,
      documentDataId: modelDocumentDataId,
      companyId: modelCompanyId,
      workspaceId: modelWorkspaceId,
      data: body.data,
    });
  }
}
