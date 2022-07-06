import { AttachmentEntity } from './../../../../../checklist/entities/attachment.entity';
import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';
import { RiskDocumentEntity } from '../../../../../checklist/entities/riskDocument.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { WorkspaceEntity } from '../../../../../company/entities/workspace.entity';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import {
  HierarchyMapData,
  IHierarchyMap,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';

export interface ICreatePGR {
  version: string;
  logo: string;
  company: CompanyEntity;
  workspace: WorkspaceEntity;
  versions: RiskDocumentEntity[];
  environments: EnvironmentEntity[];
  document: RiskFactorGroupDataEntity;
  homogeneousGroup: IHomoGroupMap;
  hierarchy: Map<string, HierarchyMapData>;
  characterizations: CharacterizationEntity[];
  attachments: AttachmentEntity[];
  hierarchyTree: IHierarchyMap;
}
