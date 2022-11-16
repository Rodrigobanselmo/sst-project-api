/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpdateUserCompanyDto } from '../../dto/update-user-company.dto';
import { UserCompanyEntity } from '../../entities/userCompany.entity';
import { IUsersCompanyRepository } from '../IUsersCompanyRepository.types';

@Injectable()
export class UsersCompanyRepository implements IUsersCompanyRepository {
  constructor(private prisma: PrismaService) {}
  async upsertMany({ userId, companyId, companiesIds, ...updateUserCompanyDto }: UpdateUserCompanyDto) {
    const UserCompanies = await Promise.all(
      companiesIds.map(
        async (companyId) =>
          await this.prisma.userCompany.upsert({
            create: { ...updateUserCompanyDto, userId, companyId },
            update: updateUserCompanyDto,
            where: { companyId_userId: { companyId, userId } },
            include: { group: true },
          }),
      ),
    );

    return UserCompanies.map((UserCompany) => new UserCompanyEntity(UserCompany));
  }

  async update({ userId, companyId, companiesIds, ...updateUserCompanyDto }: UpdateUserCompanyDto) {
    const UserCompany = await this.prisma.userCompany.update({
      data: updateUserCompanyDto,
      where: { companyId_userId: { companyId, userId } },
      include: { group: true },
    });

    return new UserCompanyEntity(UserCompany);
  }

  async findByUserIdAndCompanyId(userId: number, companyId: string): Promise<UserCompanyEntity> {
    const UserCompany = await this.prisma.userCompany.findUnique({
      where: { companyId_userId: { userId, companyId } },
    });
    if (!UserCompany) return;
    return new UserCompanyEntity(UserCompany);
  }

  async deleteAllFromConsultant(userId: number, companyId: string) {
    await this.prisma.userCompany.deleteMany({
      where: {
        OR: [
          { userId, companyId },
          {
            userId,
            company: {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: companyId },
              },
            },
          },
        ],
      },
    });
  }
}
