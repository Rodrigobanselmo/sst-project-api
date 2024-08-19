import { ProfessionalVO } from "../values-object/professional.vo";

export type IProfessionalCouncilEntity = {
  id: number;
  councilType: string;
  councilUF: string;
  councilId: string;
  professional: ProfessionalVO;
}

export class ProfessionalCouncilEntity {
  id: number;
  councilType: string;
  councilUF: string;
  councilId: string;
  professional: ProfessionalVO;

  constructor(params: IProfessionalCouncilEntity) {
    this.id = params.id;
    this.councilType = params.councilType;
    this.councilUF = params.councilUF;
    this.councilId = params.councilId;
    this.professional = params.professional;
  }
}
