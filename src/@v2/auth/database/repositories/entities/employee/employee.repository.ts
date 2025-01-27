import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IEmployeeRepository } from './employee.types';
import { EmployeeMapper } from '../../../mappers/entities/employee.mapper';

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const select = { id: true } satisfies Prisma.EmployeeFindFirstArgs['select'];

    return { select };
  }

  async find(params: IEmployeeRepository.FindParams): IEmployeeRepository.FindReturn {
    const employee = await this.prisma.employee.findFirst({
      where: { id: params.id },
      ...EmployeeRepository.selectOptions(),
    });

    return employee ? EmployeeMapper.toEntity(employee) : null;
  }
}
