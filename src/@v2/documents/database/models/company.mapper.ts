import { Company, AddressCompany, DocumentCover, Activity } from '@prisma/client';
import { CompanyModel } from '../../domain/models/company.model';
import { AddressModel } from '../../domain/models/address.model';
import { CoverModel } from '../../domain/models/cover.model';
import { CoverTypeEnum } from '@/@v2/shared/domain/enum/company/cover-type.enum';
import { CompanyDocumentsCoverVO } from '@/@v2/shared/domain/values-object/company/company-document-cover.vo';
import { ConsultantModel } from '../../domain/models/consultant.model';

export type ICompanyMapper = Company & {
  address: AddressCompany | null
  primary_activity: Activity[];
  covers: DocumentCover[]
  receivingServiceContracts: {
    applyingServiceCompany: Company & {
      address: AddressCompany | null
      covers: DocumentCover[]
    }
  }[]
}

export class CompanyMapper {
  static toModel(data: ICompanyMapper): CompanyModel {

    const consultant = data.receivingServiceContracts.find((consult) => !consult?.applyingServiceCompany?.isGroup)?.applyingServiceCompany || null
    const primaryActivity = data.primary_activity[0]

    return new CompanyModel({
      id: data.id,
      name: data.name,
      cnpj: data.cnpj || '00000000000000',
      address: data.address ? new AddressModel(data.address) : null,
      email: data.email,
      fantasyName: data.fantasy,
      initials: data.initials,
      logoUrl: data.logoUrl,
      mission: data.mission,
      vision: data.vision,
      values: data.values,
      shortName: data.shortName,
      responsibleName: data.responsibleName,
      primaryActivityCode: primaryActivity.code,
      primaryActivityRiskDegree: primaryActivity.riskDegree,
      primaryActivityName: primaryActivity.name,
      operationTime: data.operationTime,
      phone: data.phone,
      consultant: consultant ? new ConsultantModel({
        address: consultant.address ? new AddressModel(consultant.address) : null,
        logoUrl: consultant.logoUrl,
        name: consultant.name,
        covers: consultant.covers.map((cover) => new CoverModel({
          types: cover.acceptType.map((type) => CoverTypeEnum[type]),
          data: new CompanyDocumentsCoverVO(cover.json as any),
        })),
      }) : null,
      covers: data.covers.map((cover) => new CoverModel({
        types: cover.acceptType.map((type) => CoverTypeEnum[type]),
        data: new CompanyDocumentsCoverVO(cover.json as any),
      })),
    })
  }
}