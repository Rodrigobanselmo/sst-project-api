import { AbsenteeismMotiveCountResultReadModel, IAbsenteeismMotiveCountResultReadModel } from './read-absenteeism-motive-count-result.model';

export type IAbsenteeismMotiveCountReadModel = {
  results: IAbsenteeismMotiveCountResultReadModel[];
};

export class AbsenteeismMotiveCountReadModel {
  results: AbsenteeismMotiveCountResultReadModel[];

  constructor(params: IAbsenteeismMotiveCountReadModel) {
    this.results = params.results;
  }
}
