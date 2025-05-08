import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CoordinatorMapper } from '../../mappers/entities/coordinator.mapper';
import { ICoordinatorRepository } from './coordinator.types';

@Injectable()
export class CoordinatorRepository implements ICoordinatorRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const select = { id: true } satisfies Prisma.UserFindFirstArgs['select'];

    return { select };
  }

  async findById({ coordinatorId, companyId }: ICoordinatorRepository.FindByIdParams): ICoordinatorRepository.FindByIdReturn {
    const coordinator = await this.prisma.user.findFirst({
      where: {
        id: coordinatorId,
        companies: {
          some: {
            companyId,
            status: { notIn: ['INACTIVE', 'CANCELED', 'EXPIRED', 'REJECTED'] },
          },
        },
      },
      ...CoordinatorRepository.selectOptions(),
    });

    return coordinator ? CoordinatorMapper.toEntity(coordinator) : null;
  }
}
