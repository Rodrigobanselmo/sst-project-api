export type ICompanyEntity = {
  id: number;
};

export class CompanyEntity {
  id: number;

  constructor(params: ICompanyEntity) {
    this.id = params.id;
  }
}
