export namespace IUseCase {
  export type Params = {
    companyId: string;
    recommendationId: string;
    riskDataId: string;
    workspaceId: string;
    buffer: Buffer;
    name: string;
    size: number;
  };
}
