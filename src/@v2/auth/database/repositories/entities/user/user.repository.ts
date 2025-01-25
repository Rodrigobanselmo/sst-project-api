import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IUserRepository } from './user.types';
import { UserMapper } from '../../../mappers/entities/user.mapper';
import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.UserFindFirstArgs['include'];

    return { include };
  }

  async create(params: IUserRepository.CreateParams): IUserRepository.CreateReturn {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: params.name,
          email: params.email,
          password: params.password,
        },
      });

      return UserMapper.toEntity(user);
    } catch (error) {
      captureException(error);
      return null;
    }
  }

  async update(params: IUserRepository.UpdateParams): IUserRepository.UpdateReturn {
    try {
      const user = await this.prisma.user.update({
        where: { id: params.id },
        data: {
          name: params.name,
        },
      });

      return UserMapper.toEntity(user);
    } catch (error) {
      captureException(error);
      return null;
    }
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

  async findByEmail(params: IUserRepository.FindByEmailParams): IUserRepository.FindByEmailReturn {
    const user = await this.prisma.user.findFirst({
      where: {
        email: params.email,
      },
      ...UserRepository.selectOptions(),
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  async findByToken(params: IUserRepository.FindByTokenParams): IUserRepository.FindByTokenReturn {
    const user = await this.prisma.user.findFirst({
      where: {
        token: params.token,
      },
      ...UserRepository.selectOptions(),
    });

    return user ? UserMapper.toEntity(user) : null;
  }
}
