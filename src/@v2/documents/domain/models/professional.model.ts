
export type IProfessionalModel = {
  name: string
  email: string;
  cpf: string;
  certifications: string[];
  formation: string[];
}

export class ProfessionalModel {
  name: string
  email: string;
  cpf: string;
  certifications: string[];
  formation: string[];

  constructor(params: IProfessionalModel) {
    this.name = params.name
    this.email = params.email;
    this.cpf = params.cpf;
    this.certifications = params.certifications;
    this.formation = params.formation;
  }
}