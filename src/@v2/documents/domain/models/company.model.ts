import { formatCnae } from "@/@v2/shared/utils/helpers/formats-cnae";
import { AddressModel } from "./address.model";
import { ConsultantModel } from "./consultant.model";

export type ICompanyModel = {
  id: string
  name: string
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

  consultant: ConsultantModel | null
  address: AddressModel | null
}

export class CompanyModel {
  id: string
  name: string
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

  consultant: ConsultantModel | null
  address: AddressModel | null

  constructor(params: ICompanyModel) {
    this.id = params.id
    this.name = params.name
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

    this.consultant = params.consultant;
    this.address = params.address
  }

  get primaryActivity() {
    if (!this.primaryActivityCode) return '';

    return `${formatCnae(this.primaryActivityCode)} - ${this.primaryActivityName || ''}`
  }
}