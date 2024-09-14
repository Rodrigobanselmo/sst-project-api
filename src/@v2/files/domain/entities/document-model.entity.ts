import { DocumentTypeEnum } from "@/@v2/shared/domain/enum/documents/document-type.enum"

export type IDocumentModelEntity = {
  id: number
  name: string
  system: boolean
  description: string | null
  type: DocumentTypeEnum

  data: Buffer
}

export class DocumentModelEntity {
  id: number
  name: string
  system: boolean
  description: string | null
  type: DocumentTypeEnum

  data: Buffer

  constructor(params: IDocumentModelEntity) {
    this.id = params.id;
    this.name = params.name
    this.system = params.system
    this.description = params.description
    this.type = params.type

    this.data = params.data;
  }

}