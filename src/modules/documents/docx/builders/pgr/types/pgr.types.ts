import { DocumentCoverEntity } from './../../../../../company/entities/document-cover.entity';
import { AttachmentEntity } from '../../../../../sst/entities/attachment.entity';
import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { WorkspaceEntity } from '../../../../../company/entities/workspace.entity';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import {
  HierarchyMapData,
  IHierarchyMap,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';

export interface ICreatePGR {
  version: string;
  logo: string;
  cover: DocumentCoverEntity;
  company: CompanyEntity;
  workspace: WorkspaceEntity;
  versions: RiskDocumentEntity[];
  environments: EnvironmentEntity[];
  document: RiskFactorGroupDataEntity;
  homogeneousGroup: IHomoGroupMap;
  consultantLogo: string;
  hierarchy: Map<string, HierarchyMapData>;
  characterizations: CharacterizationEntity[];
  attachments: AttachmentEntity[];
  hierarchyTree: IHierarchyMap;
}
