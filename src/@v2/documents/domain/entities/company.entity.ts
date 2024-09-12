
export type ICompanyEntity = {
  id: string
  name: string
  cnpj: string;
}

export class CompanyEntity {
  id: string;
  name: string
  cnpj: string;

  constructor(params: ICompanyEntity) {
    this.id = params.id;
    this.name = params.name
    this.cnpj = params.cnpj;
  }
}