import { DocumentTypeEnum } from "@/@v2/documents/domain/enums/document-type.enum";

export interface IDocumentPGRParams {
  id?: string;
  documentDataId: string;
  name: string;
  version: string;
  description?: string;
  companyId: string;
  workspaceId: string;
  workspaceName: string;
  type: DocumentTypeEnum;
}
