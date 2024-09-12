import { AddressModel } from "./address.model"

export type IWorkspaceModel = {
  id: string
  name: string
  cnpj: string | null
  isOwner: boolean
  address: AddressModel | null
}

export class WorkspaceModel {
  id: string
  name: string
  cnpj: string | null
  isOwner: boolean
  address: AddressModel | null

  constructor(params: IWorkspaceModel) {
    this.id = params.id;
    this.name = params.name
    this.cnpj = params.cnpj
    this.isOwner = params.isOwner

    this.address = params.address
  }
}