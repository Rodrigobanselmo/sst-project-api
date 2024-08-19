import { DocumentTypeEnum } from "../enums/document-type.enum"
import { IDocumentModelData } from "../types/document-mode-data.type"

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

  data: IDocumentModelData | null = null

  constructor(params: IDocumentModelEntity) {
    this.id = params.id;
    this.name = params.name
    this.system = params.system
    this.description = params.description
    this.type = params.type

    if (params.data) {
      try {
        this.data = JSON.parse(params.data.toString('utf8'));
      } catch (e) {
        //! captureException(error)
        this.data = null;
      }
    }
  }
}