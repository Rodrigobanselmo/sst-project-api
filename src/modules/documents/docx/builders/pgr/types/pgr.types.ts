import { ProfessionalEntity } from './../../../../../users/entities/professional.entity';
import { WorkspaceEntity } from '../../../../../company/entities/workspace.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { RiskDocumentEntity } from '../../../../../checklist/entities/riskDocument.entity';

export interface ICreatePGR {
  version: string;
  logo: string;
  company: CompanyEntity;
  workspace: WorkspaceEntity;
  versions: RiskDocumentEntity[];
  professionals: ProfessionalEntity[];
}
