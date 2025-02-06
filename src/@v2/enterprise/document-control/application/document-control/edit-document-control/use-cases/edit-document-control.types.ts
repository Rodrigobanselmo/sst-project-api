export namespace IDocumentControlUseCase {
  export type Params = {
    id: number;
    name: string | undefined;
    companyId: string;
    description: string | undefined | null;
    type: string | undefined;
  };
}
