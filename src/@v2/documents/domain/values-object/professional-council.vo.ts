
export type IProfessionalCouncilVO = {
  councilType: string;
  councilUF: string;
  councilId: string;
}

export class ProfessionalCouncilVO {
  councilType: string;
  councilUF: string;
  councilId: string;

  constructor(params: ProfessionalCouncilVO) {
    this.councilType = params.councilType;
    this.councilUF = params.councilUF;
    this.councilId = params.councilId;
  }
}
