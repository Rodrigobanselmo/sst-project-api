import { Injectable } from '@nestjs/common'
import { ProductDocumentPGR } from '../../products/document-pgr/document-pgr.product'
import { DocumentCreationService } from '../../../../services/document-creation/document-creation.service'
import { ICreatorDocumentPGR } from './document-pgr.types'
import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao'
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository'
import { DonwloadImageService } from '@/@v2/documents/application/services/donwload-image/donwload-image.service'

@Injectable()
export class CreatorDocumentPGR {
  constructor(
    private readonly documentCreationService: DocumentCreationService,

    protected readonly documentDAO: DocumentDAO,
    protected readonly documentVersionRepository: DocumentVersionRepository,
    protected readonly donwloadImageService: DonwloadImageService
  ) { }

  async execute({ documentVersionId }: ICreatorDocumentPGR.Params) {
    this.documentCreationService.execute({
      product: this.factoryMethod(),
      body: { documentVersionId }
    })
  }

  private factoryMethod() {
    return new ProductDocumentPGR(
      this.documentDAO,
      this.documentVersionRepository,
      this.donwloadImageService,
    )
  }
}
