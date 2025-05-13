export namespace IStatusUseCase {
  export type Params = {
    name: string;
    companyId: string;
    type: string;
    color?: string | null;
  };
}
