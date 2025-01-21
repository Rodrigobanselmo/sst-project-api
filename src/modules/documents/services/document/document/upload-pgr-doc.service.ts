import { Injectable } from '@nestjs/common';

import { CreatorDocumentPGR } from '@/@v2/documents/application/factories/document/creators/document-pgr/document-pgr.creator';
import { UploadDocumentDto } from '../../../dto/document.dto';

@Injectable()
export class PgrUploadService {
  constructor(private readonly creatorDocumentPGR: CreatorDocumentPGR) {}
  async execute(body: UploadDocumentDto) {
    return await this.creatorDocumentPGR.execute({
      documentVersionId: body.id as string,
      homogeneousGroupsIds: body.ghoIds,
    });
  }
}
