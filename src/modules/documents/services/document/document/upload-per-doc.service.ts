import { Injectable } from '@nestjs/common';

import { CreatorDocumentPER } from '@/@v2/documents/factories/document/creators/document-per/document-per.creator';
import { UploadDocumentDto } from '../../../dto/document.dto';

@Injectable()
export class PerUploadService {
  constructor(private readonly creatorDocumentPER: CreatorDocumentPER) {}
  async execute(body: UploadDocumentDto) {
    return await this.creatorDocumentPER.execute({
      documentVersionId: body.id as string,
      homogeneousGroupsIds: body.ghoIds,
    });
  }
}
