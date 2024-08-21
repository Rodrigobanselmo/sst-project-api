
export type IConsultantEntity = {
  id: string
  name: string
}

export class ConsultantEntity {
  id: string;
  name: string

  constructor(params: IConsultantEntity) {
    this.id = params.id;
    this.name = params.name
  }
}