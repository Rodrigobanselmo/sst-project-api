export namespace IDocumentControlUseCase {
  export type Params = {
    name: string;
    companyId: string;
    workspaceId: string;
    description?: string;
    type: string;
    file?: {
      fileId?: string;
      endDate?: Date;
      startDate?: Date;
      name?: string;
    };
  };
}
