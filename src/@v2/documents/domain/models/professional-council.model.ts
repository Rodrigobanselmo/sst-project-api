import { ProfessionalModel } from "./professional.model";

export type IProfessionalCouncilModel = {
  id: number;
  councilType: string;
  councilUF: string;
  councilId: string;
  professional: ProfessionalModel;
}

export class ProfessionalCouncilModel {
  id: number;
  councilType: string;
  councilUF: string;
  councilId: string;
  professional: ProfessionalModel;

  constructor(params: IProfessionalCouncilModel) {
    this.id = params.id;
    this.councilType = params.councilType;
    this.councilUF = params.councilUF;
    this.councilId = params.councilId;
    this.professional = params.professional;
  }
}
