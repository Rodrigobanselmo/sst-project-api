import { CoverTypeEnum } from '@/@v2/shared/domain/enum/company/cover-type.enum';
import { formatCnae } from '@/@v2/shared/utils/helpers/formats-cnae';
import { AddressModel } from './address.model';
import { ConsultantModel } from './consultant.model';
import { CoverModel } from './cover.model';

export type ICompanyModel = {
  id: string;
  name: string;
  fantasyName: string | null;
  cnpj: string;
  initials: string | null;
  email: string | null;
  phone: string | null;
  shortName: string | null;
  operationTime: string | null;
  responsibleName: string | null;
  mission: string | null;
  vision: string | null;
  values: string | null;
  primaryActivityCode: string | null;
  primaryActivityName: string | null;
  primaryActivityRiskDegree: number | null;
  logoUrl: string | null;

  covers: CoverModel[];
  consultant: ConsultantModel | null;
  address: AddressModel | null;
};

export class CompanyModel {
  id: string;
  name: string;
  fantasyName: string;
  cnpj: string;
  initials: string;
  email: string;
  phone: string;
  shortName: string;
  operationTime: string;
  responsibleName: string;
  mission: string;
  vision: string;
  values: string;
  primaryActivityCode: string;
  primaryActivityName: string;
  primaryActivityRiskDegree: string;
  logoUrl: string | null;
  logoPath: string | null;

  private covers: CoverModel[];
  consultant: ConsultantModel | null;
  address: AddressModel | null;

  constructor(params: ICompanyModel) {
    this.id = params.id;
    this.name = params.name;
    this.fantasyName = params.fantasyName || '';
    this.cnpj = params.cnpj;
    this.initials = params.initials || '';
    this.email = params.email || '';
    this.phone = params.phone || '';
    this.shortName = params.shortName || '';
    this.operationTime = params.operationTime || '';
    this.responsibleName = params.responsibleName || '';
    this.mission = params.mission || '';
    this.vision = params.vision || '';
    this.values = params.values || '';
    this.primaryActivityCode = params.primaryActivityCode || '';
    this.primaryActivityName = params.primaryActivityName || '';
    this.primaryActivityRiskDegree = String(params.primaryActivityRiskDegree || '');
    this.logoUrl = params.logoUrl;
    this.logoPath = null;

    this.covers = params.covers;
    this.consultant = params.consultant;
    this.address = params.address;
  }

  get primaryActivity() {
    if (!this.primaryActivityCode) return '';

    return `${formatCnae(this.primaryActivityCode)} - ${this.primaryActivityName || ''}`;
  }

  get indentificationName() {
    return this.initials || this.shortName || this.fantasyName || this.name;
  }

  get consultantLogoPath() {
    return this.consultant?.logoPath || 'images/logo/logo-simple.png';
  }

  cover(type: CoverTypeEnum) {
    const allCovers = [...this.covers, ...(this.consultant?.covers || [])];

    // First try to find a cover that explicitly includes this type
    const exactMatch = allCovers.find((cover) => cover.types.includes(type));
    if (exactMatch) return exactMatch.data;

    // Fallback: use a cover with empty types (applies to all types)
    const fallback = allCovers.find((cover) => cover.types.length === 0);
    return fallback?.data || null;
  }
}
