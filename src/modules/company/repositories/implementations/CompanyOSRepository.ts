import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CompanyOSDto } from '../../dto/os.dto';
import { CompanyOSEntity } from './../../entities/os.entity';

@Injectable()
export class CompanyOSRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({ companyId, id, ...data }: CompanyOSDto) {
    const document = await this.prisma.companyOS.upsert({
      create: { companyId, ...data },
      update: { companyId, ...data },
      where: { id_companyId: { companyId, id: id || 0 } },
    });

    return new CompanyOSEntity(document);
  }

  async findNude(options: Prisma.CompanyOSFindManyArgs = {}) {
    const documents = await this.prisma.companyOS.findMany({
      ...options,
    });

    return documents.map((document) => new CompanyOSEntity(document));
  }

  async findFirstNude(options: Prisma.CompanyOSFindFirstArgs = {}) {
    const document = await this.prisma.companyOS.findFirst({
      ...options,
    });

    return new CompanyOSEntity(document);
  }

  async delete(id: number, companyId: string) {
    const document = await this.prisma.companyOS.delete({
      where: { id_companyId: { companyId, id } },
    });

    return new CompanyOSEntity(document);
  }
}
