import { DocumentTypeEnum } from "../enums/document-type.enum"
import { IDocumentModelData } from "../types/document-mode-data.types"

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
  data: IDocumentModelData | null

  constructor(params: IDocumentModelEntity) {
    this.id = params.id;
    this.name = params.name
    this.system = params.system
    this.description = params.description
    this.type = params.type
    this.data = DocumentModelEntity.convertData(params.data);
  }

  static convertData(data: Buffer) {
    if (data) {
      try {
        return JSON.parse(data.toString('utf8')) as IDocumentModelData;
      } catch (e) {
        //! captureException(error)
        return null;
      }
    }

    return null;
  }
}