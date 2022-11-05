import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertAddCertDto } from '../../dto/add-cert.dto';
import { CompanyCertEntity } from '../../entities/companyCert.entity';

@Injectable()
export class CompanyCertRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({ companyId, ...rest }: UpsertAddCertDto) {
    const companyCert = await this.prisma.companyCert.upsert({
      where: { companyId },
      create: { companyId, ...rest },
      update: { companyId, ...rest },
    });

    return new CompanyCertEntity(companyCert);
  }

  async findByCompanyId(companyId: string) {
    const companyCert = await this.prisma.companyCert.findUnique({
      where: { companyId },
    });
    if (!companyCert) return;
    return new CompanyCertEntity(companyCert);
  }
}
