/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

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

  /** Alinha ao mesmo escopo do findNude em permissões (consultoria / contrato / clínica / grupo). */
  private consultantScopedLinksWhere(userId: number, contextCompanyId: string): Prisma.UserCompanyWhereInput {
    return {
      userId,
      OR: [
        { companyId: contextCompanyId },
        {
          company: {
            receivingServiceContracts: {
              some: { applyingServiceCompanyId: contextCompanyId },
            },
          },
        },
        {
          company: {
            applyingServiceContracts: {
              some: { receivingServiceCompanyId: contextCompanyId },
            },
          },
        },
        {
          company: {
            companiesToClinicAvailable: {
              some: { companyId: contextCompanyId },
            },
          },
        },
        {
          company: {
            group: {
              companyId: contextCompanyId,
            },
          },
        },
      ],
    };
  }

  /**
   * Remove apenas vínculos elegíveis no escopo da consultoria cujo companyId não está em companiesIdsToKeep.
   * companiesIdsToKeep vazio → remove todos os vínculos nesse escopo (substituição “zerada”).
   */
  async deleteConsultantScopedLinksNotInCompaniesIds(
    userId: number,
    contextCompanyId: string,
    companiesIdsToKeep: string[],
  ) {
    const scoped = this.consultantScopedLinksWhere(userId, contextCompanyId);

    if (!companiesIdsToKeep.length) {
      return this.prisma.userCompany.deleteMany({ where: scoped });
    }

    return this.prisma.userCompany.deleteMany({
      where: {
        ...scoped,
        companyId: { notIn: companiesIdsToKeep },
      },
    });
  }

  async deleteAllFromConsultant(userId: number, companyId: string) {
    return this.deleteConsultantScopedLinksNotInCompaniesIds(userId, companyId, []);
  }

  /**
   * Remove vínculos do usuário cujo companyId não está em companiesIdsToKeep,
   * limitando ao conjunto gerenciável pela listagem da edição (ids retornados pelo mesmo escopo que GET /company).
   */
  async deleteManageableUserCompanyLinksNotInCompaniesIds(
    userId: number,
    companiesIdsToKeep: string[],
    manageableCompanyIds: string[],
  ) {
    if (!manageableCompanyIds.length) {
      return { count: 0 };
    }

    if (!companiesIdsToKeep.length) {
      return this.prisma.userCompany.deleteMany({
        where: {
          userId,
          companyId: { in: manageableCompanyIds },
        },
      });
    }

    return this.prisma.userCompany.deleteMany({
      where: {
        userId,
        companyId: {
          notIn: companiesIdsToKeep,
          in: manageableCompanyIds,
        },
      },
    });
  }
}
