import { ConsultantModel } from "./consultant.model";

export type ICompanyModel = {
  id: string
  name: string
  cnpj: string;
  consultant?: ConsultantModel
}

export class CompanyModel {
  id: string;
  name: string
  cnpj: string;
  consultant?: ConsultantModel

  constructor(params: ICompanyModel) {
    this.id = params.id;
    this.name = params.name
    this.cnpj = params.cnpj;
    this.consultant = params.consultant;
  }
}