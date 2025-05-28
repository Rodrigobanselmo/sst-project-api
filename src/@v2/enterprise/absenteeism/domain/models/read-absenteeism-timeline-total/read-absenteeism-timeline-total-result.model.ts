import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';

export type IAbsenteeismTimelineTotalResultReadModel = {
  date: Date;
  documents: number;
  days: number;
};

export class AbsenteeismTimelineTotalResultReadModel {
  date: Date;
  documents: number;
  days: number;

  constructor(params: IAbsenteeismTimelineTotalResultReadModel) {
    this.date = params.date;
    this.documents = params.documents;
    this.days = params.days;
  }
}
