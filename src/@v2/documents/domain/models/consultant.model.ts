import { AddressModel } from "./address.model"

export type IConsultantModel = {
  name: string
  address: AddressModel | null
  logoUrl: string | null
}

export class ConsultantModel {
  name: string
  address: AddressModel | null
  logoUrl: string | null
  logoPath: string | null

  constructor(params: IConsultantModel) {
    this.name = params.name
    this.address = params.address
    this.logoUrl = params.logoUrl
    this.logoPath = null
  }
}