import { ConsultantEntity } from "./consultant.entity";

export type ICompanyEntity = {
  id: string
  name: string
  cnpj: string;
  consultant?: ConsultantEntity
}

export class CompanyEntity {
  id: string;
  name: string
  cnpj: string;
  consultant?: ConsultantEntity

  constructor(params: ICompanyEntity) {
    this.id = params.id;
    this.name = params.name
    this.cnpj = params.cnpj;
    this.consultant = params.consultant;
  }
}