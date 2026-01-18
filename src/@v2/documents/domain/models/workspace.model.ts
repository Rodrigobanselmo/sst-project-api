import { AddressModel } from './address.model';

export type IWorkspaceModel = {
  id: string;
  name: string;
  isOwner: boolean;
  address: AddressModel | null;

  cnpj: string | null;
  razaoSocial: string | null;
  riskDegree: number | null;
  cnaeLabel: string | null;
  cnaeCode: string | null;
  workSchedule: string | null;

  customSectionHTML: string | null;
  logoUrl: string | null;
};

export class WorkspaceModel {
  id: string;
  name: string;
  isOwner: boolean;
  address: AddressModel | null;

  cnpj: string | null;
  razaoSocial: string | null;
  riskDegree: number | null;
  cnaeLabel: string | null;
  cnaeCode: string | null;
  workSchedule: string | null;

  customSectionHTML: string | null;
  logoUrl: string | null;
  logoPath: string | null;

  constructor(params: IWorkspaceModel) {
    this.id = params.id;
    this.name = params.name;
    this.isOwner = params.isOwner;
    this.address = params.address;

    this.cnpj = params.cnpj;
    this.razaoSocial = params.razaoSocial;
    this.riskDegree = params.riskDegree;
    this.cnaeLabel = params.cnaeLabel;
    this.cnaeCode = params.cnaeCode;
    this.workSchedule = params.workSchedule;

    this.customSectionHTML = params.customSectionHTML;
    this.logoUrl = params.logoUrl;
    this.logoPath = null;
  }
}
