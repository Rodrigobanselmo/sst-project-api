import { ProfessionalEntity } from "./professional.entity";

export type IProfessionalSignatureEntity = {
  isSigner: boolean;
  isElaborator: boolean;
  professional: ProfessionalEntity;
}

export class ProfessionalSignatureEntity {
  isSigner: boolean;
  isElaborator: boolean;
  professional: ProfessionalEntity;

  constructor(params: IProfessionalSignatureEntity) {
    this.isSigner = params.isSigner;
    this.isElaborator = params.isElaborator;
    this.professional = params.professional;
  }
}