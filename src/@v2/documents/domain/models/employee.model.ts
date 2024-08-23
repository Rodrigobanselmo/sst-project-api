import { ProfessionalCouncilModel } from "./professional-council.model";

export type IEmployeeModel = {
  name: string
}

export class EmployeeModel {
  name: string

  constructor(params: IEmployeeModel) {
    this.name = params.name;
  }
}