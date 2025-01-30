import { DocumentFile } from '@/@modules/shared/utils/types/document-file'
import { Response } from '@/@modules/shared/utils/types/response'

export interface ReadDocument {
  read(params: ReadDocument.Params): ReadDocument.Result
}

export namespace ReadDocument {
  export type Params = {
    documentId: number
    resourceId: string | number
  }

  export type Result = Promise<Response<DocumentFile | null>>
}
