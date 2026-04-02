import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository';
import { ProductDocumentPGR } from '@/@v2/documents/factories/document/products/document-pgr/document-pgr.product';
import { IProductDocumentPGR } from '@/@v2/documents/factories/document/products/document-pgr/document-pgr.types';
import { createBaseDocument } from '@/@v2/documents/libs/docx/base/config/document';
import { DownloadImageService } from '@/@v2/documents/services/download-image/download-image.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentTypeEnum } from '@prisma/client';
import { Packer } from 'docx';
import { unlinkSync } from 'fs';

import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';

/**
 * Deve ficar em DocumentsModule (com SSTModule + exports do DocumentModule v2).
 * Não registrar no DocumentModule v2: RiskDocumentRepository não existe nesse contexto e quebra o bootstrap de toda a API.
 */
@Injectable()
export class DownloadPgrConsolidatedDocxService {
  constructor(
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly documentDAO: DocumentDAO,
    private readonly documentVersionRepository: DocumentVersionRepository,
    private readonly downloadImageService: DownloadImageService,
  ) {}

  async execute(riskDocumentId: string, companyId: string) {
    const riskDoc = await this.riskDocumentRepository.findById(riskDocumentId, companyId, {
      include: { documentData: true },
    });

    if (!riskDoc?.id) {
      throw new BadRequestException('Documento não encontrado');
    }

    const docType = (riskDoc as { documentData?: { type?: DocumentTypeEnum } }).documentData?.type;
    if (docType !== DocumentTypeEnum.PGR) {
      throw new BadRequestException('Download consolidado disponível apenas para PGR');
    }

    const body: IProductDocumentPGR = {
      documentVersionId: riskDocumentId,
      homogeneousGroupsIds: undefined,
    };

    const product = new ProductDocumentPGR(this.documentDAO, this.documentVersionRepository, this.downloadImageService);

    try {
      const data = await product.getData(body);
      const attachmentsPayload = await product.getAttachments({ data, body });
      const attachmentModels = attachmentsPayload.map((a) => a.model);

      const sections = await product.getConsolidatedSections({
        data,
        attachments: attachmentModels,
        body,
      });

      const Doc = createBaseDocument(sections);
      const b64 = await Packer.toBase64String(Doc);
      const buffer = Buffer.from(b64, 'base64');

      const fileName = product.getFileName(data, 'PGR-COMPLETO');

      return { buffer, fileName };
    } finally {
      product.unlinkPaths
        .filter((i) => i?.path && typeof i.path === 'string')
        .forEach(({ path }) => {
          try {
            unlinkSync(path);
          } catch {
            // ignore
          }
        });
    }
  }
}
