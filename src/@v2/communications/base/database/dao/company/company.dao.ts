import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ICompanyDao } from './company.dao.types';
import { CompanyMapper } from '../../mappers/models/company.mapper';

@Injectable()
export class CompanyCommunicationDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async find(params: ICompanyDao.FindParams): ICompanyDao.FindReturn {
    const company = await this.prisma.company.findFirst({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        logoUrl: true,
      },
    });

    return company ? CompanyMapper.toModel(company) : null;
  }
}
