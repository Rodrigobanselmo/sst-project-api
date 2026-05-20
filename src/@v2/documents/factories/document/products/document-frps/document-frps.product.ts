import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { getDocumentFileName } from '@/@v2/documents/libs/docx/helpers/get-document-file-name';
import { DownloadImageService } from '@/@v2/documents/services/download-image/download-image.service';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { BadRequestException } from '@nestjs/common';
import { ProductDocumentPGR } from '../document-pgr/document-pgr.product';
import { IProductDocumentFRPS } from './document-frps.types';

export class ProductDocumentFRPS extends ProductDocumentPGR {
  public override type = 'FRPS';

  constructor(
    documentDAO: DocumentDAO,
    documentVersionRepository: DocumentVersionRepository,
    downloadImageService: DownloadImageService,
  ) {
    super(documentDAO, documentVersionRepository, downloadImageService);
  }

  public override async getData({ documentVersionId, homogeneousGroupsIds }: IProductDocumentFRPS) {
    const document = await this.documentDAO.findDocumentFRPS({ documentVersionId, homogeneousGroupsIds });
    if (!document) throw new BadRequestException('Nenhum documento FRPS cadastrado');

    await this.downloadImages(document);

    return document;
  }

  public override getFileName = (data: DocumentPGRModel, type = 'FRPS') => {
    return getDocumentFileName({
      name: data.documentVersion.name || '',
      companyName: data.documentBase.company.indentificationName,
      version: data.documentVersion.version,
      typeName: type,
      date: dateUtils().format('MMMM-YYYY'),
    });
  };
}
