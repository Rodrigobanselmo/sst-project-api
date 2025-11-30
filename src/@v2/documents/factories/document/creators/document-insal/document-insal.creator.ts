import { Injectable } from '@nestjs/common';
import { DocumentCreationService } from '../../../../services/document-creation/document-creation.service';
import { ICreatorDocumentINSAL } from './document-insal.types';
import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository';
import { DownloadImageService } from '@/@v2/documents/services/download-image/download-image.service';
import { ProductDocumentINSAL } from '../../products/document-insal/document-insal.product';

@Injectable()
export class CreatorDocumentINSAL {
  constructor(
    private readonly documentCreationService: DocumentCreationService,

    protected readonly documentDAO: DocumentDAO,
    protected readonly documentVersionRepository: DocumentVersionRepository,
    protected readonly donwloadImageService: DownloadImageService,
  ) {}

  async execute({ documentVersionId, homogeneousGroupsIds }: ICreatorDocumentINSAL.Params) {
    this.documentCreationService.execute({
      product: this.factoryMethod(),
      body: { documentVersionId, homogeneousGroupsIds },
    });
  }

  private factoryMethod() {
    return new ProductDocumentINSAL(this.documentDAO, this.documentVersionRepository, this.donwloadImageService);
  }
}

