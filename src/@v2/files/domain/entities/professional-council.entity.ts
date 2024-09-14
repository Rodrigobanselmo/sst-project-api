
export type IProfessionalCouncilEntity = {
  id: number;
  councilType: string;
  councilUF: string;
  councilId: string;
}

export class ProfessionalCouncilEntity {
  id: number;
  councilType: string;
  councilUF: string;
  councilId: string;

  constructor(params: IProfessionalCouncilEntity) {
    this.id = params.id;
    this.councilType = params.councilType;
    this.councilUF = params.councilUF;
    this.councilId = params.councilId;
  }
}
