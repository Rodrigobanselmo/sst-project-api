import { IDocumentModelData } from "../types/document-mode-data.types";

export function convertModelDataBuffer(data: Buffer) {
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