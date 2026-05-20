import { Injectable } from '@nestjs/common';

import { CreatorDocumentFRPS } from '@/@v2/documents/factories/document/creators/document-frps/document-frps.creator';
import { UploadDocumentDto } from '../../../dto/document.dto';

@Injectable()
export class FrpsUploadService {
  constructor(private readonly creatorDocumentFRPS: CreatorDocumentFRPS) {}
  async execute(body: UploadDocumentDto) {
    return await this.creatorDocumentFRPS.execute({
      documentVersionId: body.id as string,
      homogeneousGroupsIds: body.ghoIds,
    });
  }
}
