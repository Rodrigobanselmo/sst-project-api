export namespace IDocumentControlUseCase {
  export type Params = {
    companyId: string;
    documentControlId: number;
    description: string | undefined;
    name: string | undefined;
    fileId: string;
    endDate: Date | undefined;
    startDate: Date | undefined;
  };
}
