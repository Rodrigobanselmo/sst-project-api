
export namespace IEditActionPlanInfoUseCase {
  export type Params = {
    companyId: string
    workspaceId: string;
    coordinatorId?: number;
    validityStart?: Date
    validityEnd?: Date
    monthsLevel_2?: number;
    monthsLevel_3?: number;
    monthsLevel_4?: number;
    monthsLevel_5?: number;
  }
}
