import { IImagesMap } from './../../../../factories/document/types/IDocumentFactory.types';
import { DocumentDataPGRDto } from './../../../../../sst/dto/document-data-pgr.dto';
import { DocumentDataEntity } from '../../../../../../modules/sst/entities/documentData.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { WorkspaceEntity } from '../../../../../company/entities/workspace.entity';
import { AttachmentEntity } from '../../../../../sst/entities/attachment.entity';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { HierarchyMapData, IHierarchyMap, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import { DocumentCoverEntity } from './../../../../../company/entities/document-cover.entity';
import { IDocumentPGRSectionGroups } from './section.types';

export interface ICreatePGR {
  version: string;
  logo: string;
  cover: DocumentCoverEntity;
  company: CompanyEntity;
  workspace: WorkspaceEntity;
  versions: RiskDocumentEntity[];
  environments: CharacterizationEntity[];
  document: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto;
  homogeneousGroup: IHomoGroupMap;
  consultantLogo: string;
  hierarchy: Map<string, HierarchyMapData>;
  characterizations: CharacterizationEntity[];
  attachments: AttachmentEntity[];
  hierarchyTree: IHierarchyMap;
  docSections?: IDocumentPGRSectionGroups;
  imagesMap?: IImagesMap;
  hierarchyHighLevelsData: Map<string, HierarchyMapData>;
}
