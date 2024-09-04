
export type IEPIModel = {
  ca: string
}

export class EPIModel {
  ca: string

  constructor(params: IEPIModel) {
    this.ca = params.ca
  }
}