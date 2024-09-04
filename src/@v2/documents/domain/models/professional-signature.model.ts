import { ProfessionalCouncilModel } from "./professional-council.model";

export type IProfessionalSignatureModel = {
  isSigner: boolean;
  isElaborator: boolean;
  professional: ProfessionalCouncilModel;
}

export class ProfessionalSignatureModel {
  isSigner: boolean;
  isElaborator: boolean;
  professionalCouncil: ProfessionalCouncilModel;

  constructor(params: IProfessionalSignatureModel) {
    this.isSigner = params.isSigner;
    this.isElaborator = params.isElaborator;
    this.professionalCouncil = params.professional;
  }
}