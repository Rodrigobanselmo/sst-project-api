import { Injectable } from '@nestjs/common';
import { DocumentCreationService } from '../../../../services/document-creation/document-creation.service';
import { ICreatorDocumentLTCAT } from './document-ltcat.types';
import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository';
import { DownloadImageService } from '@/@v2/documents/services/download-image/download-image.service';
import { ProductDocumentLTCAT } from '../../products/document-ltcat/document-ltcat.product';

@Injectable()
export class CreatorDocumentLTCAT {
  constructor(
    private readonly documentCreationService: DocumentCreationService,

    protected readonly documentDAO: DocumentDAO,
    protected readonly documentVersionRepository: DocumentVersionRepository,
    protected readonly donwloadImageService: DownloadImageService,
  ) {}

  async execute({ documentVersionId, homogeneousGroupsIds }: ICreatorDocumentLTCAT.Params) {
    this.documentCreationService.execute({
      product: this.factoryMethod(),
      body: { documentVersionId, homogeneousGroupsIds },
    });
  }

  private factoryMethod() {
    return new ProductDocumentLTCAT(this.documentDAO, this.documentVersionRepository, this.donwloadImageService);
  }
}

