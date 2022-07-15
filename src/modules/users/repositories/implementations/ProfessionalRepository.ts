/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { ProfessionalEntity } from '../../entities/professional.entity';
import { UserEntity } from '../../entities/user.entity';
import { UserCompanyEntity } from '../../entities/userCompany.entity';

@Injectable()
export class ProfessionalRepository {
  constructor(private prisma: PrismaService) {}

  async findByCompanyId(
    companyId: string,
  ): Promise<(ProfessionalEntity | UserEntity)[]> {
    const professionals = await this.prisma.professional.findMany({
      where: {
        OR: [
          { companyId },
          {
            company: {
              applyingServiceContracts: {
                some: { receivingServiceCompanyId: companyId },
              },
            },
          },
        ],
      },
    });

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { companies: { some: { companyId } } },
          {
            companies: {
              some: {
                company: {
                  applyingServiceContracts: {
                    some: { receivingServiceCompanyId: companyId },
                  },
                },
              },
            },
          },
        ],
      },
    });

    const usersEntity = users.map((user) => new UserEntity(user));
    const professionalsEntity = professionals.map(
      (professional) => new ProfessionalEntity(professional),
    );

    return [...usersEntity, ...professionalsEntity];
  }
}
