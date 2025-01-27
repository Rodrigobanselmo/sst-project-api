import { EmployeeEntity } from '@/@v2/auth/domain/entities/employee.entity';

export namespace IEmployeeRepository {
  export type FindParams = { id: number };
  export type FindReturn = Promise<EmployeeEntity | null>;
}
