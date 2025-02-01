import { isNotAnMeasure } from '@/@v2/shared/domain/functions/shared/isNotAnMeasure';

export type IAdministrativeMeasureModel = {
  name: string;
};

export class AdministrativeMeasureModel {
  name: string;

  constructor(params: IAdministrativeMeasureModel) {
    this.name = params.name;
  }

  get isNotAnMeasure() {
    return isNotAnMeasure(this.name);
  }
}
