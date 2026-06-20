import { Injectable } from '@nestjs/common';

import { CreatorDocumentPGR } from '@/@v2/documents/factories/document/creators/document-pgr/document-pgr.creator';
import { parseDocumentGenerationRiskFilter } from '@/@v2/documents/domain/types/document-generation-risk-filter.type';
import { UploadDocumentDto } from '../../../dto/document.dto';

@Injectable()
export class PgrUploadService {
  constructor(private readonly creatorDocumentPGR: CreatorDocumentPGR) {}
  async execute(body: UploadDocumentDto) {
    return await this.creatorDocumentPGR.execute({
      documentVersionId: body.id as string,
      homogeneousGroupsIds: body.ghoIds,
      documentDate: body.documentDate,
      riskFilter: parseDocumentGenerationRiskFilter(body.riskFilter),
    });
  }
}
