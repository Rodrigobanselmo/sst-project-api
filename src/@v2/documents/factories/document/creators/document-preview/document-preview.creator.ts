import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentModelModel } from '@/@v2/documents/domain/models/document-model.model';
import { DownloadImageService } from '@/@v2/documents/services/download-image/download-image.service';
import { Injectable } from '@nestjs/common';
import { DocumentCreationService } from '../../../../services/document-creation/document-creation.service';
import { ProductDocumentPreview } from '../../products/document-preview/document-preview.product';
import { ICreatorDocumentPreview } from './document-preview.types';

@Injectable()
export class CreatorDocumentPreview {
  constructor(
    private readonly documentCreationService: DocumentCreationService,

    protected readonly documentDAO: DocumentDAO,
    protected readonly downloadImageService: DownloadImageService,
  ) {}

  async execute({ data }: ICreatorDocumentPreview.Params) {
    return await this.documentCreationService.execute({
      product: this.factoryMethod(),
      body: { model: new DocumentModelModel(data) },
    });
  }

  private factoryMethod() {
    return new ProductDocumentPreview(this.documentDAO);
  }
}
