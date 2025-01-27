export type IEmployeeEntity = {
  id: number;
};

export class EmployeeEntity {
  id: number;

  constructor(params: IEmployeeEntity) {
    this.id = params.id;
  }
}
