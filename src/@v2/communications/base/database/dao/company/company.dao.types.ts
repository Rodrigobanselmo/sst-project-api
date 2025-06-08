import { CompanyFlagsModel } from '../../../domain/models/company-flags.model';
import { CompanyModel } from '../../../domain/models/company.model';

export namespace ICompanyDao {
  export type FindParams = { id: string };
  export type FindReturn = Promise<CompanyModel | null>;

  export type FindFlagsParams = { companyId: string };
  export type FindFlagsReturn = Promise<CompanyFlagsModel | null>;
}
