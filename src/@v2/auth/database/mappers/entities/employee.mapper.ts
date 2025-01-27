import { EmployeeEntity } from '@/@v2/auth/domain/entities/employee.entity';

export type IEmployeeEntityMapper = {
  id: number;
};

export class EmployeeMapper {
  static toEntity(data: IEmployeeEntityMapper): EmployeeEntity {
    return new EmployeeEntity({
      id: data.id,
    });
  }
}
