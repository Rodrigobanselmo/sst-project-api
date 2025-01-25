export type IActionPlanInfoModel = {
  validityStart: Date | null;
  validityEnd: Date | null;
  periods: {
    monthsLevel_2: number;
    monthsLevel_3: number;
    monthsLevel_4: number;
    monthsLevel_5: number;
  };
  coordinator: {
    id: number;
    name: string | null;
    email: string | null;
  } | null;
};

export class ActionPlanInfoModel {
  validityStart: Date | null;
  validityEnd: Date | null;
  periods: {
    monthsLevel_2: number;
    monthsLevel_3: number;
    monthsLevel_4: number;
    monthsLevel_5: number;
  };
  coordinator: {
    id: number;
    name: string;
    email: string;
  } | null;

  constructor(params: IActionPlanInfoModel) {
    this.validityStart = params.validityStart;
    this.validityEnd = params.validityEnd;
    this.periods = {
      monthsLevel_2: params.periods.monthsLevel_2,
      monthsLevel_3: params.periods.monthsLevel_3,
      monthsLevel_4: params.periods.monthsLevel_4,
      monthsLevel_5: params.periods.monthsLevel_5,
    };
    this.coordinator = params.coordinator
      ? {
          id: params.coordinator.id,
          name: params.coordinator.name,
          email: params.coordinator.email,
        }
      : null;
  }
}
