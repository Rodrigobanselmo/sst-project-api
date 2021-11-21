import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { ILicenseRepository } from '../ILicenseRepository.types';
import { LicenseEntity } from './../../entities/license.entity';

@Injectable()
export class LicenseRepository implements ILicenseRepository {
  constructor(private prisma: PrismaService) {}

  async findByCompanyId(companyId: string) {
    const license = await this.prisma.license.findUnique({
      where: { companyId },
    });
    if (!license) return;
    return new LicenseEntity(license);
  }
}
