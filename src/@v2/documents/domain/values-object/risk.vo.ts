
export type IRiskVO = {
  name: string
}

export class RiskVO {
  name: string

  constructor(params: IRiskVO) {
    this.name = params.name
  }
}