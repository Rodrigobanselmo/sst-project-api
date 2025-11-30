import { Injectable } from '@nestjs/common';

import { CreatorDocumentLTCAT } from '@/@v2/documents/factories/document/creators/document-ltcat/document-ltcat.creator';
import { UploadDocumentDto } from '../../../dto/document.dto';

@Injectable()
export class LtcatUploadService {
  constructor(private readonly creatorDocumentLTCAT: CreatorDocumentLTCAT) {}
  async execute(body: UploadDocumentDto) {
    return await this.creatorDocumentLTCAT.execute({
      documentVersionId: body.id as string,
      homogeneousGroupsIds: body.ghoIds,
    });
  }
}

