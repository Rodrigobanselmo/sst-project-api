import { modelCompanyId, modelDocumentDataId, modelWorkspaceId } from './../../../../../shared/constants/ids';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

import { DownloadPreviewModelData } from '../../../dto/document-model.dto';
import { DocumentPGRPreviewFactory } from '../../../factories/document/products/PGR/DocumentPGRPreviewFactory';
import { CreatorDocumentPreview } from '@/@v2/documents/factories/document/creators/document-preview/document-preview.creator';

@Injectable()
export class DownloadPreviewModel {
  constructor(private readonly documentPGRPreviewFactory: CreatorDocumentPreview) {}
  async execute(body: DownloadPreviewModelData, user: UserPayloadDto) {
    return await this.documentPGRPreviewFactory.execute({
      data: body.data as any,
    });
  }
}
