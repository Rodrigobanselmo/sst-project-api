import { Company } from '@prisma/client';
import { CompanyModel } from '../../domain/models/company.model';

export type ICompanyMapper = Company & {
  receivingServiceContracts: {
    applyingServiceCompany: Company
  }[]
}

export class CompanyMapper {
  static toModel(data: ICompanyMapper): CompanyModel {

    return new CompanyModel({
      id: data.id,
      name: data.name,
      cnpj: data.cnpj || '00000000000000',
      consultant: data.receivingServiceContracts.find((consult) => !consult?.applyingServiceCompany?.isGroup)?.applyingServiceCompany || null,
    })
  }
}