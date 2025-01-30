import { DocumentFile } from '@/@modules/shared/utils/types/document-file'
import { Response } from '@/@modules/shared/utils/types/response'

export interface AddDocument {
  add(params: AddDocument.Params): AddDocument.Result
}

export namespace AddDocument {
  export type Params = {
    buffer: Buffer
    fileName: string
    resourceId: string | number
    shouldDelete?: boolean
    bucket?: string
  }

  export type Result = Promise<Response<DocumentFile>>
}
