export namespace IAbsenteeismUseCase {
  export type Params = {
    companyId: string;
    workspacesIds: string[] | undefined;
    hierarchiesIds: string[] | undefined;
    motivesIds: number[] | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}
