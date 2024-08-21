
export type IConsultantModel = {
  name: string
}

export class ConsultantModel {
  name: string

  constructor(params: IConsultantModel) {
    this.name = params.name
  }
}