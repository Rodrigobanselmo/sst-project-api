/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { ProfessionalEntity } from '../../entities/professional.entity';
import { UserCompanyEntity } from '../../entities/userCompany.entity';

@Injectable()
export class ProfessionalRepository {
  constructor(private prisma: PrismaService) {}

  async findByCompanyId(companyId: string): Promise<ProfessionalEntity[]> {
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

    return professionals.map(
      (professional) => new ProfessionalEntity(professional),
    );
  }
}
