import { formatDocumentValidityRange } from "../../libs/docx/helpers/format-document-validity.util";
import { DocumentTypeEnum } from "../../../shared/domain/enum/documents/document-type.enum";
import { DocumentBaseDataVO } from "../values-object/document-base-data.vo";
import { CompanyModel } from "./company.model";
import { DocumentModelModel } from "./document-model.model";
import { ProfessionalSignatureModel } from "./professional-signature.model";
import { WorkspaceModel } from "./workspace.model";
import { VersionModel } from "./version.model";

export type IDocumentBaseModel = {
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
  model: DocumentModelModel;
  workspace: WorkspaceModel;
  company: CompanyModel;
  versions: VersionModel[];
  professionalSignatures: ProfessionalSignatureModel[];
}

export class DocumentBaseModel {
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
  model: DocumentModelModel;
  workspace: WorkspaceModel;
  company: CompanyModel;
  _versions: VersionModel[];
  professionalSignatures: ProfessionalSignatureModel[];

  constructor(partial: IDocumentBaseModel) {
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
    this.model = partial.model;
    this.workspace = partial.workspace;
    this.company = partial.company;
    this._versions = partial.versions;
    this.professionalSignatures = partial.professionalSignatures;
  }


  get validUntil(): string {
    return formatDocumentValidityRange(this.validityStart, this.validityEnd);
  }

  /** Todas as versões persistidas do documento (sem filtro). */
  get allVersions(): VersionModel[] {
    return this._versions;
  }

  get mainLogoPath(): string | null {
    // Prioritize workspace logo over company logo (capa principal e cabeçalho interno)
    return this.workspace?.logoPath || this.company?.logoPath || null;
  }

  /** Logo da empresa objeto do documento (divisórias/subcapas). Sem fallback para workspace. */
  get documentOwnerLogoPath(): string | null {
    return this.company?.logoPath || null;
  }

  get consultantLogoPath(): string | null {
    return this.company?.consultant?.logoPath || this.company?.logoPath || null;
  }
}
