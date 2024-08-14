import { ProfessionalCouncilVO } from "../values-object/professional-council.vo";

export type IProfessionalEntity = {
  id: string
  name: string
  email: string;
  cpf: string;
  certifications: string[];
  formation: string[];
  councils: ProfessionalCouncilVO[];
}

export class ProfessionalEntity {
  id: string
  name: string
  email: string;
  cpf: string;
  certifications: string[];
  formation: string[];
  councils: ProfessionalCouncilVO[];

  constructor(params: IProfessionalEntity) {
    this.id = params.id;
    this.name = params.name
    this.email = params.email;
    this.cpf = params.cpf;
    this.certifications = params.certifications;
    this.formation = params.formation;
    this.councils = params.councils
  }
}