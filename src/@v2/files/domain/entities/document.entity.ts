type DocumentConstructor = {
  id?: number
  fileName: string
  resourceId?: string
  bucket?: string
  url: string
  shouldDelete?: boolean
}

export class Document {
  id: number
  fileName: string
  bucket?: string
  resourceId?: string
  shouldDelete?: boolean
  url: string

  constructor(params: DocumentConstructor) {
    this.id = params.id || -1
    this.url = params.url
    this.fileName = params.fileName
    this.resourceId = params.resourceId
    this.shouldDelete = params.shouldDelete
    this.bucket = params.bucket
  }
}
