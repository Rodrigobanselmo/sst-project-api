import { AddressModel } from "./address.model"

export type IConsultantModel = {
  name: string
  address: AddressModel | null
}

export class ConsultantModel {
  name: string
  address: AddressModel | null

  constructor(params: IConsultantModel) {
    this.name = params.name
    this.address = params.address
  }
}