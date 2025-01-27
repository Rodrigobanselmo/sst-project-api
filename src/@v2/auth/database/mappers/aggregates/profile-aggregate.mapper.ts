import { User } from '@prisma/client';
import { IProfileEntityMapper, ProfileMapper } from '../entities/profile.mapper';
import { UserMapper } from '../entities/user.mapper';
import { ProfileAggregate } from '../../../domain/aggregate/profile.aggregate';
import { EmployeeMapper } from '../entities/employee.mapper';

type IUserEntityMapper = IProfileEntityMapper & {
  user: User & {
    Employee: {
      id: number;
    }[];
  };
};

export class ProfileAggregateMapper {
  static toEntity(data: IUserEntityMapper): ProfileAggregate {
    const employee = data.user.Employee[0];
    return new ProfileAggregate({
      profile: ProfileMapper.toEntity(data),
      user: UserMapper.toEntity(data.user),
      employee: employee ? EmployeeMapper.toEntity(employee) : null,
    });
  }
}
