
export type IRiskEntity = {
  id: string
  name: string
}

export class RiskEntity {
  id: string
  name: string

  constructor(params: IRiskEntity) {
    this.id = params.id
    this.name = params.name
  }
}