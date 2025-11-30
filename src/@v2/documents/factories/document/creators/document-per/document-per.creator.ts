import { Injectable } from '@nestjs/common';
import { DocumentCreationService } from '../../../../services/document-creation/document-creation.service';
import { ICreatorDocumentPER } from './document-per.types';
import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository';
import { DownloadImageService } from '@/@v2/documents/services/download-image/download-image.service';
import { ProductDocumentPER } from '../../products/document-per/document-per.product';

@Injectable()
export class CreatorDocumentPER {
  constructor(
    private readonly documentCreationService: DocumentCreationService,

    protected readonly documentDAO: DocumentDAO,
    protected readonly documentVersionRepository: DocumentVersionRepository,
    protected readonly donwloadImageService: DownloadImageService,
  ) {}

  async execute({ documentVersionId, homogeneousGroupsIds }: ICreatorDocumentPER.Params) {
    this.documentCreationService.execute({
      product: this.factoryMethod(),
      body: { documentVersionId, homogeneousGroupsIds },
    });
  }

  private factoryMethod() {
    return new ProductDocumentPER(this.documentDAO, this.documentVersionRepository, this.donwloadImageService);
  }
}
