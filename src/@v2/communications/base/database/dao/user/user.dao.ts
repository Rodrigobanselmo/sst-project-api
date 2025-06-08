import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IUserDao } from './user.dao.types';
import { UserMapper } from '../../mappers/models/user.mapper';

@Injectable()
export class UserCommunicationDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async find(params: IUserDao.FindParams): IUserDao.FindReturn {
    const user = await this.prisma.user.findFirst({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        token: true,
        password: true,
      },
    });

    return user ? UserMapper.toModel(user) : null;
  }
}
