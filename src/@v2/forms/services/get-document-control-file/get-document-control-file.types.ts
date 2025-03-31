export namespace IDocumentControlFileService {
  export type Params = {
    companyId: string;
    fileId: string;
    documentControlId: number;
    endDate?: Date;
    startDate?: Date;
    description?: string;
  };
}
