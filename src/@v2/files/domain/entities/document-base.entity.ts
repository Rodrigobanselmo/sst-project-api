import { DocumentModelEntity } from "@/modules/documents/entities/document-model.entity";
import { CompanyEntity } from "./company.entity";
import { ProfessionalSignatureEntity } from "./professional-signature.entity";
import { WorkspaceEntity } from "./workspace.entity";
import { DocumentBaseDataVO } from "@/@v2/documents/domain/values-object/document-base-data.vo";
import { DocumentTypeEnum } from "@/@v2/shared/domain/enum/documents/document-type.enum";

export type IDocumentBaseEntity = {
  id: string;
  name: string;
  type: DocumentTypeEnum
  validityStart: Date | null;
  validityEnd: Date | null;
  elaboratedBy: string | null;
  approvedBy: string | null;
  revisionBy: string | null;
  coordinatorBy: string | null;

  data: DocumentBaseDataVO;
  entity: DocumentModelEntity;
  workspace: WorkspaceEntity;
  company: CompanyEntity;
  professionalSignatures: ProfessionalSignatureEntity[];
}

export class DocumentBaseEntity {
  id: string;
  name: string;
  type: DocumentTypeEnum
  validityStart: Date | null;
  validityEnd: Date | null;
  elaboratedBy: string | null;
  approvedBy: string | null;
  revisionBy: string | null;
  coordinatorBy: string | null;

  data: DocumentBaseDataVO;
  entity: DocumentModelEntity;
  workspace: WorkspaceEntity;
  company: CompanyEntity;
  professionalSignatures: ProfessionalSignatureEntity[];

  constructor(partial: IDocumentBaseEntity) {
    this.id = partial.id;
    this.name = partial.name;
    this.type = partial.type;
    this.validityStart = partial.validityStart;
    this.validityEnd = partial.validityEnd;
    this.elaboratedBy = partial.elaboratedBy;
    this.approvedBy = partial.approvedBy;
    this.revisionBy = partial.revisionBy;
    this.coordinatorBy = partial.coordinatorBy;

    this.data = partial.data;
    this.entity = partial.entity;
    this.workspace = partial.workspace;
    this.company = partial.company;
    this.professionalSignatures = partial.professionalSignatures;
  }
}
