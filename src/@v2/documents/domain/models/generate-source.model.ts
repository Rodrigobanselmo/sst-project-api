
export type IGenerateSourceModel = {
  name: string
}

export class GenerateSourceModel {
  name: string


  constructor(params: IGenerateSourceModel) {
    this.name = params.name
  }
}