export namespace IDocumentControlUseCase {
  export type Params = {
    companyId: string;
    documentControlFileId: number;
    description: string | undefined | null;
    fileId: string | undefined | null;
    name: string | undefined;
    endDate: Date | undefined | null;
    startDate: Date | undefined | null;
  };
}
