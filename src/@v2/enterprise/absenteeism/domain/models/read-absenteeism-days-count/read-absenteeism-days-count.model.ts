import { AbsenteeismDaysCountResultReadModel, IAbsenteeismDaysCountResultReadModel } from './read-absenteeism-days-count-result.model';

export type IAbsenteeismDaysCountReadModel = {
  results: IAbsenteeismDaysCountResultReadModel[];
};

export class AbsenteeismDaysCountReadModel {
  results: AbsenteeismDaysCountResultReadModel[];

  constructor(params: IAbsenteeismDaysCountReadModel) {
    this.results = params.results;
  }
}
