import { AddressModel } from "./address.model"
import { CoverModel } from "./cover.model"

export type IConsultantModel = {
  name: string
  address: AddressModel | null
  logoUrl: string | null
  covers: CoverModel[]
}

export class ConsultantModel {
  name: string
  address: AddressModel | null
  logoUrl: string | null
  logoPath: string | null
  covers: CoverModel[]

  constructor(params: IConsultantModel) {
    this.name = params.name
    this.address = params.address
    this.logoUrl = params.logoUrl
    this.logoPath = null

    this.covers = params.covers
  }
}