import { AbsenteeismTimelineTotalResultReadModel } from './read-absenteeism-timeline-total-result.model';

export type IAbsenteeismTimelineTotalReadModel = {
  results: AbsenteeismTimelineTotalResultReadModel[];
};

export class AbsenteeismTimelineTotalReadModel {
  results: AbsenteeismTimelineTotalResultReadModel[];

  constructor(params: IAbsenteeismTimelineTotalReadModel) {
    this.results = params.results;
  }
}
