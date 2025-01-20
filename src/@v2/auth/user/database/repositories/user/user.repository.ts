import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IUserRepository } from './user.types';
import { UserMapper } from '../../mappers/entities/user.mapper';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.UserFindFirstArgs['include'];

    return { include };
  }

  async create(params: IUserRepository.CreateParams): IUserRepository.CreateReturn {
    const user = await this.prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        password: params.password,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  async update(params: IUserRepository.UpdateParams): IUserRepository.UpdateReturn {
    const user = await this.prisma.user.update({
      where: { id: params.id },
      data: {
        name: params.name,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  async find(params: IUserRepository.FindParams): IUserRepository.FindReturn {
    const user = await this.prisma.user.findFirst({
      where: {
        id: params.id,
        companies: {
          some: {
            companyId: params.companyId,
          },
        },
      },
      ...UserRepository.selectOptions(),
    });

    return user ? UserMapper.toEntity(user) : null;
  }
}
