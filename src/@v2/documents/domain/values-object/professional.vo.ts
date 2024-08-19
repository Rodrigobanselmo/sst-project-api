
export type IProfessionalVO = {
  name: string
  email: string;
  cpf: string;
  certifications: string[];
  formation: string[];
}

export class ProfessionalVO {
  name: string
  email: string;
  cpf: string;
  certifications: string[];
  formation: string[];

  constructor(params: IProfessionalVO) {
    this.name = params.name
    this.email = params.email;
    this.cpf = params.cpf;
    this.certifications = params.certifications;
    this.formation = params.formation;
  }
}