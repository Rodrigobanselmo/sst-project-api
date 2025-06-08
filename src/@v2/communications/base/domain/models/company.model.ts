export type ICompanyModel = {
  id: string;
  name: string;
  logoUrl: string | undefined;
};

export class CompanyModel {
  id: string;
  name: string;
  logoUrl?: string;

  constructor(params: ICompanyModel) {
    this.id = params.id;
    this.name = params.name;
    this.logoUrl = params.logoUrl;
  }
}
