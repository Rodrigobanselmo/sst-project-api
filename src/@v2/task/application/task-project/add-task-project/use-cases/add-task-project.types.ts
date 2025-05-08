export namespace ITaskProjectUseCase {
  export type Params = {
    companyId: string;
    name: string;
    description?: string;
    members?: { userId: number }[];
  };
}
