
export type IAdministrativeMeasureModel = {
  name: string
}

export class AdministrativeMeasureModel {
  name: string


  constructor(params: IAdministrativeMeasureModel) {
    this.name = params.name
  }
}