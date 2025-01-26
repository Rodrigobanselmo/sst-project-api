import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ICompanyDAO } from './company.types';

@Injectable()
export class CompanyDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async FindByIdParams(params: ICompanyDAO.FindByIdParams) {
    const user = await this.prisma.company.findFirst({
      where: {
        id: params.id,
      },
      select: {
        name: true,
      },
    });

    return user;
  }
}
