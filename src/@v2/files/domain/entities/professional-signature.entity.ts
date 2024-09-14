import { ProfessionalCouncilEntity } from "./professional-council.entity";

export type IProfessionalSignatureEntity = {
  isSigner: boolean;
  isElaborator: boolean;
  professional: ProfessionalCouncilEntity;
}

export class ProfessionalSignatureEntity {
  isSigner: boolean;
  isElaborator: boolean;
  professional: ProfessionalCouncilEntity;

  constructor(params: IProfessionalSignatureEntity) {
    this.isSigner = params.isSigner;
    this.isElaborator = params.isElaborator;
    this.professional = params.professional;
  }
}