export type IAbsenteeismMotiveCountResultReadModel = {
  count: number;
  type: string;
};

export class AbsenteeismMotiveCountResultReadModel {
  count: number;
  type: string;

  constructor(params: IAbsenteeismMotiveCountResultReadModel) {
    this.count = params.count;
    this.type = params.type;
  }
}
