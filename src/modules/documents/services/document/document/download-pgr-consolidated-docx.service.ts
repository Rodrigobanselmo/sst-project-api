import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository';
import { ProductDocumentFRPS } from '@/@v2/documents/factories/document/products/document-frps/document-frps.product';
import { ProductDocumentPGR } from '@/@v2/documents/factories/document/products/document-pgr/document-pgr.product';
import { IProductDocumentPGR } from '@/@v2/documents/factories/document/products/document-pgr/document-pgr.types';
import { createBaseDocument } from '@/@v2/documents/libs/docx/base/config/document';
import { DownloadImageService } from '@/@v2/documents/services/download-image/download-image.service';
import {
  getPgrConsolidatedTypeLabel,
  type PgrAnnexProfile,
} from '@/@v2/documents/libs/docx/builders/pgr/constants/pgr-annex-catalog.util';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentTypeEnum } from '@prisma/client';
import { Packer } from 'docx';
import { unlinkSync } from 'fs';

import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import {
  getSnapshotGhoIds,
  getSnapshotRiskFilter,
} from '@/@v2/documents/database/utils/apply-generation-snapshot.util';

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

  async execute(
    riskDocumentId: string,
    companyId: string,
    profile: PgrAnnexProfile = 'full',
  ) {
    const riskDoc = await this.riskDocumentRepository.findById(riskDocumentId, companyId, {
      include: { documentData: true },
    });

    if (!riskDoc?.id) {
      throw new BadRequestException('Documento não encontrado');
    }

    const docType = (riskDoc as { documentData?: { type?: DocumentTypeEnum } }).documentData?.type;
    const supportsConsolidated =
      docType === DocumentTypeEnum.PGR || docType === DocumentTypeEnum.FRPS;
    if (!supportsConsolidated) {
      throw new BadRequestException(
        'Download consolidado disponível apenas para PGR e FRPS',
      );
    }

    const body: IProductDocumentPGR = {
      documentVersionId: riskDocumentId,
      homogeneousGroupsIds: getSnapshotGhoIds(riskDoc.generationSnapshot),
      riskFilter: getSnapshotRiskFilter(riskDoc.generationSnapshot),
    };

    const product =
      docType === DocumentTypeEnum.FRPS
        ? new ProductDocumentFRPS(
            this.documentDAO,
            this.documentVersionRepository,
            this.downloadImageService,
          )
        : new ProductDocumentPGR(
            this.documentDAO,
            this.documentVersionRepository,
            this.downloadImageService,
          );

    try {
      const data = await product.getData(body);
      const attachmentsPayload = await product.getAttachments({ data, body });
      const attachmentModels = attachmentsPayload.map((a) => a.model);

      const sections = await product.getConsolidatedSections({
        data,
        attachments: attachmentModels,
        body,
        profile,
      });

      const Doc = createBaseDocument(sections);
      const b64 = await Packer.toBase64String(Doc);
      const buffer = Buffer.from(b64, 'base64');

      const documentPrefix = docType === DocumentTypeEnum.FRPS ? 'FRPS' : 'PGR';
      const consolidatedLabel = getPgrConsolidatedTypeLabel(profile, documentPrefix);
      const fileName = product.getFileName(data, consolidatedLabel);

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
