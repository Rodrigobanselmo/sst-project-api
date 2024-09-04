export type IEmployeeModel = {
  id: string
  name: string
}

export class EmployeeModel {
  id: string
  name: string

  constructor(params: IEmployeeModel) {
    this.id = params.id;
    this.name = params.name;
  }
}