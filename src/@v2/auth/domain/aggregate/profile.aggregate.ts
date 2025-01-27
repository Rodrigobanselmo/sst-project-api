import { EmployeeEntity } from '../entities/employee.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { UserEntity } from '../entities/user.entity';

export type IProfileAggregate = {
  profile: ProfileEntity;
  user: UserEntity;
  employee: EmployeeEntity | null;
};

export class ProfileAggregate {
  profile: ProfileEntity;
  user: UserEntity;
  private _employee: EmployeeEntity | null;

  constructor(params: IProfileAggregate) {
    this.user = params.user;
    this.profile = params.profile;
    this._employee = params.employee;
  }

  get employee() {
    return this._employee;
  }

  setEmployee(employee: EmployeeEntity) {
    if (this._employee) return [null, 'Funcionário já cadastrado'];
    this._employee = employee;

    return [null, null];
  }
}
