import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';
import { RiskDocumentEntity } from '../../../../../checklist/entities/riskDocument.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { WorkspaceEntity } from '../../../../../company/entities/workspace.entity';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import {
  HierarchyMapData,
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
}
