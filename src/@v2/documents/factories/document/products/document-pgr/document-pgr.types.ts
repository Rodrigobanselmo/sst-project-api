import type { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import type { DocumentGenerationRiskFilterSnapshot } from '@/@v2/documents/domain/types/document-generation-risk-filter.type';
import type { PgrAnnexProfile } from '@/@v2/documents/libs/docx/builders/pgr/constants/pgr-annex-catalog.util';
import type { IGetDocument } from '../../types/document-factory.types';

export interface IProductDocumentPGR {
  documentVersionId: string;
  homogeneousGroupsIds?: string[];
  documentDate?: string;
  riskFilter?: DocumentGenerationRiskFilterSnapshot;
}

export type { PgrAnnexProfile };

export interface IGetConsolidatedDocumentPGR
  extends IGetDocument<IProductDocumentPGR, DocumentPGRModel> {
  profile?: PgrAnnexProfile;
}
