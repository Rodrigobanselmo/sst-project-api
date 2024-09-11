import { formatCnae } from "@/@v2/shared/utils/helpers/formats-cnae";
import { AddressModel } from "./address.model";
import { ConsultantModel } from "./consultant.model";
import { CompanyDocumentsCoverVO } from "@/@v2/shared/domain/values-object/company/company-document-cover.vo";

export type ICompanyModel = {
  id: string
  name: string
  fantasyName: string
  cnpj: string;
  employeeCount: number
  initials: string | null
  email: string | null
  phone: string | null
  shortName: string | null
  operationTime: string | null
  responsibleName: string | null
  mission: string | null
  vision: string | null
  values: string | null
  primaryActivityCode: string | null
  primaryActivityName: string | null
  primaryActivityRiskDegree: number | null
  logoUrl: string | null

  cover: CompanyDocumentsCoverVO | null
  consultant: ConsultantModel | null
  address: AddressModel | null
}

export class CompanyModel {
  id: string
  name: string
  fantasyName: string
  cnpj: string;
  employeeCount: number
  initials: string
  email: string
  phone: string
  shortName: string
  operationTime: string
  responsibleName: string
  mission: string
  vision: string
  values: string
  primaryActivityCode: string
  primaryActivityName: string
  primaryActivityRiskDegree: string
  logoUrl: string | null
  logoPath: string | null

  cover: CompanyDocumentsCoverVO | null
  consultant: ConsultantModel | null
  address: AddressModel | null

  constructor(params: ICompanyModel) {
    this.id = params.id
    this.name = params.name
    this.fantasyName = params.fantasyName
    this.cnpj = params.cnpj
    this.employeeCount = params.employeeCount
    this.initials = params.initials || ''
    this.email = params.email || ''
    this.phone = params.phone || ''
    this.shortName = params.shortName || ''
    this.operationTime = params.operationTime || ''
    this.responsibleName = params.responsibleName || ''
    this.mission = params.mission || ''
    this.vision = params.vision || ''
    this.values = params.values || ''
    this.primaryActivityCode = params.primaryActivityCode || ''
    this.primaryActivityName = params.primaryActivityName || ''
    this.primaryActivityRiskDegree = String(params.primaryActivityRiskDegree || '')
    this.logoUrl = params.logoUrl
    this.logoPath = null

    this.cover = params.cover;
    this.consultant = params.consultant;
    this.address = params.address
  }

  get primaryActivity() {
    if (!this.primaryActivityCode) return '';

    return `${formatCnae(this.primaryActivityCode)} - ${this.primaryActivityName || ''}`
  }

  get indentificationName() {
    return this.initials || this.shortName || this.fantasyName || this.name;
  }

  get consultantLogoPath() {
    return this.consultant?.logoPath || 'images/logo/logo-simple.png';
  }
}