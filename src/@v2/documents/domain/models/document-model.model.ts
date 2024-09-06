import { DocumentModelEntity } from "../entities/document-model.entity"
import { IDocumentModelData } from "../types/document-mode-data.types"
import { IImage } from "../types/elements.types"
import { parseModelData } from "../../application/libs/docx/builders/pgr/functions/parseModelData"
import { IDocumentSectionGroup, IDocumentSectionGroups } from "../../application/libs/docx/builders/pgr/types/IDocumentPGRSectionGroups"

export type IDocumentModelModel = {
  data: Buffer
}

export class DocumentModelModel {
  #data: IDocumentModelData | null = null
  sections: IDocumentSectionGroup[] = []
  variables: Record<string, string> = {}

  constructor(params: IDocumentModelModel) {
    this.#data = DocumentModelEntity.convertData(params.data);

    const data = this.data()
    this.sections = data.sections
    this.variables = data.variables
  }

  get imagesUrls() {
    const imagesPath = new Set<string>()

    this.#data?.sections.forEach((section) => {
      if (!section.children) return
      Object.values(section.children).forEach((data) => {
        data.forEach((child) => {
          if (child.type === 'IMAGE' && child.url) {
            imagesPath.add(child.url)
          }
        })
      })
    }, [])

    return Array.from(imagesPath)
  }

  private data(): IDocumentSectionGroups {
    const modelData = this.#data
    if (!modelData) return {
      sections: [],
      variables: {}
    }

    return parseModelData(modelData)
  }
}