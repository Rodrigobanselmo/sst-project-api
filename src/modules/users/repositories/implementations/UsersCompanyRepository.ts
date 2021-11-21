/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpdateUserCompanyDto } from '../../dto/update-user-company.dto';
import { UserCompanyEntity } from '../../entities/userCompany.entity';
import { IUsersCompanyRepository } from '../IUsersCompanyRepository.types';

@Injectable()
export class UsersCompanyRepository implements IUsersCompanyRepository {
  constructor(private prisma: PrismaService) {}
  async update({
    userId,
    companyId,
    ...updateUserCompanyDto
  }: UpdateUserCompanyDto) {
    const UserCompany = await this.prisma.userCompany.update({
      data: updateUserCompanyDto,
      where: { companyId_userId: { companyId, userId } },
    });

    return new UserCompanyEntity(UserCompany);
  }

  async findByUserIdAndCompanyId(
    userId: number,
    companyId: string,
  ): Promise<UserCompanyEntity> {
    const UserCompany = await this.prisma.userCompany.findUnique({
      where: { companyId_userId: { userId, companyId } },
    });
    if (!UserCompany) return;
    return new UserCompanyEntity(UserCompany);
  }
}
