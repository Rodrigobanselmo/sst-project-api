/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UserCompanyEntity } from '../../entities/userCompany.entity';
import { IUsersCompanyRepository } from '../IUsersCompanyRepository.types';

@Injectable()
export class UsersCompanyRepository implements IUsersCompanyRepository {
  constructor(private prisma: PrismaService) {}
  async findByUserIdAndCompanyId(
    userId: number,
    companyId: number,
  ): Promise<UserCompanyEntity> {
    const UserCompany = await this.prisma.userCompany.findUnique({
      where: { companyId_userId: { userId, companyId } },
    });
    if (!UserCompany) return;
    return new UserCompanyEntity(UserCompany);
  }
}
