export type IEmployeeModel = {
  id: number
}

export class EmployeeModel {
  id: number

  constructor(params: IEmployeeModel) {
    this.id = params.id;
  }
}