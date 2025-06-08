import { CompanyModel } from '../../../domain/models/company.model';

export type ICompanyModelMapper = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export class CompanyMapper {
  static toModel(data: ICompanyModelMapper): CompanyModel {
    return new CompanyModel({
      id: data.id,
      name: data.name,
      logoUrl: data.logoUrl || undefined,
    });
  }
}
