export namespace IEditManyCharacterizationUseCase {
  export type Params = {
    companyId: string;
    workspaceId: string;
    ids: string[];
    stageId: number | undefined;
  };
}
