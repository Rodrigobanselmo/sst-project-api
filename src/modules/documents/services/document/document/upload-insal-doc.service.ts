import { Injectable } from '@nestjs/common';

import { CreatorDocumentINSAL } from '@/@v2/documents/factories/document/creators/document-insal/document-insal.creator';
import { UploadDocumentDto } from '../../../dto/document.dto';

@Injectable()
export class InsalUploadService {
  constructor(private readonly creatorDocumentINSAL: CreatorDocumentINSAL) {}
  async execute(body: UploadDocumentDto) {
    return await this.creatorDocumentINSAL.execute({
      documentVersionId: body.id as string,
      homogeneousGroupsIds: body.ghoIds,
    });
  }
}

