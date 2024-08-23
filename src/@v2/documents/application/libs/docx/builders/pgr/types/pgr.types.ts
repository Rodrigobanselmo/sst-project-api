import { IExamOrigins } from './../../../../../sst/entities/exam.entity';
import { IImagesMap } from './../../../../factories/document/types/IDocumentFactory.types';
import { DocumentDataPGRDto } from './../../../../../sst/dto/document-data-pgr.dto';
import { DocumentDataEntity } from '../../../../../../modules/sst/entities/documentData.entity';
import { CompanyModel } from '../../../../../company/entities/company.entity';
import { WorkspaceEntity } from '../../../../../company/entities/workspace.entity';
import { AttachmentModel } from '../../../../../sst/entities/attachment.entity';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { HierarchyMapData, IHierarchyMap, IHomoGroupMap, IRiskMap } from '../../../converter/hierarchy.converter';
import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import { DocumentCoverEntity } from './../../../../../company/entities/document-cover.entity';
import { IDocumentSectionGroups } from '@/@v2/documents/application/libs/docx/builders/pgr/types/IDocumentPGRSectionGroups';

export interface ICreatePGR {
  version: string;
  logo: string;
  cover: DocumentCoverEntity;
  company: CompanyModel;
  workspace: WorkspaceEntity;
  versions: RiskDocumentEntity[];
  environments: CharacterizationEntity[];
  document: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto;
  homogeneousGroup: IHomoGroupMap;
  consultantLogo: string;
  hierarchy: Map<string, HierarchyMapData>;
  characterizations: CharacterizationEntity[];
  attachments: AttachmentModel[];
  hierarchyTree: IHierarchyMap;
  docSections?: IDocumentSectionGroups;
  imagesMap?: IImagesMap;
  hierarchyHighLevelsData: Map<string, HierarchyMapData>;
  exams?: IExamOrigins[];
  risksMap?: IRiskMap;
}