export type IAbsenteeismDaysCountResultReadModel = {
  count: number;
  range: string;
};

export class AbsenteeismDaysCountResultReadModel {
  count: number;
  range: string;

  constructor(params: IAbsenteeismDaysCountResultReadModel) {
    this.count = params.count;
    this.range = params.range;
  }
}
