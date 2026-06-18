import { Injectable } from '@nestjs/common';
import { DocumentCreationService } from '../../../../services/document-creation/document-creation.service';
import { ICreatorDocumentFRPS } from './document-frps.types';
import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository';
import { DownloadImageService } from '@/@v2/documents/services/download-image/download-image.service';
import { ProductDocumentFRPS } from '../../products/document-frps/document-frps.product';

@Injectable()
export class CreatorDocumentFRPS {
  constructor(
    private readonly documentCreationService: DocumentCreationService,

    protected readonly documentDAO: DocumentDAO,
    protected readonly documentVersionRepository: DocumentVersionRepository,
    protected readonly donwloadImageService: DownloadImageService,
  ) {}

  async execute({ documentVersionId, homogeneousGroupsIds, documentDate }: ICreatorDocumentFRPS.Params) {
    await this.documentCreationService.execute({
      product: this.factoryMethod(),
      body: { documentVersionId, homogeneousGroupsIds, documentDate },
    });
  }

  private factoryMethod() {
    return new ProductDocumentFRPS(this.documentDAO, this.documentVersionRepository, this.donwloadImageService);
  }
}
