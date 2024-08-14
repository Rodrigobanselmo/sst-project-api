import { DocumentTypeEnum } from "../enums/document-type.enum";
import { DocumentBaseDataVO } from "../values-object/document-base-data.vo";
import { CompanyEntity } from "./company.entity";
import { DocumentModelEntity } from "./document-model.entity";
import { ProfessionalSignatureEntity } from "./professional-signature.entity";
import { WorkspaceEntity } from "./workspace.entity";

export type IDocumentBaseEntity = {
  id: string;
  name: string;
  type: DocumentTypeEnum
  validityStart?: Date;
  validityEnd?: Date;
  elaboratedBy?: string;
  approvedBy?: string;
  revisionBy?: string;
  coordinatorBy?: string;

  data: DocumentBaseDataVO;
  model: DocumentModelEntity;
  workspace: WorkspaceEntity;
  company: CompanyEntity;
  professionalSignatures: ProfessionalSignatureEntity[];
}

export class DocumentBaseEntity {
  id: string;
  name: string;


  workspace: WorkspaceEntity;
  company: CompanyEntity;

  constructor(partial: IDocumentBaseEntity) {
    this.id = partial.id;
    this.name = partial.name;
    this.workspace = partial.workspace;
    this.company = partial.company;
  }
}
