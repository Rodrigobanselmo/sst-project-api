import { CompanyModel } from '../../../domain/models/company.model';

export namespace ICompanyDao {
  export type FindParams = { id: string };
  export type FindReturn = Promise<CompanyModel | null>;
}
