
export type IEngineeringMeasureModel = {
  name: string
  efficientlyCheck: boolean
}

export class EgineeringMeasureModel {
  name: string
  efficientlyCheck: boolean


  constructor(params: IEngineeringMeasureModel) {
    this.name = params.name
    this.efficientlyCheck = params.efficientlyCheck
  }
}