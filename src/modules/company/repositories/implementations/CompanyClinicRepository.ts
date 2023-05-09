import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { FindCompanyClinicDto, SetCompanyClinicDto } from '../../dto/company-clinic.dto';
import { CompanyClinicsEntity } from '../../entities/company-clinics.entity';

@Injectable()
export class CompanyClinicRepository {
  constructor(private prisma: PrismaService) {}

  async set(createCompanyDto: SetCompanyClinicDto, companyId: string) {
    await this.prisma.$transaction([
      this.prisma.companyClinics.deleteMany({ where: { companyId } }),
      this.prisma.companyClinics.createMany({
        data: createCompanyDto.ids
          .filter((data) => data.clinicId != data.companyId)
          .map(({ clinicId, companyId }) => ({
            clinicId,
            companyId,
          })),
      }),
    ]);
  }

  async findAllByCompany(query: Partial<FindCompanyClinicDto>, pagination: PaginationQueryDto, options: Prisma.CompanyClinicsFindManyArgs = {}) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query && query.search) {
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.companyClinics.count({
        where,
      }),
      this.prisma.companyClinics.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
      }),
    ]);

    return {
      data: response[1].map((companyClinic) => new CompanyClinicsEntity(companyClinic)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.CompanyClinicsFindManyArgs = {}) {
    const companyClinics = await this.prisma.companyClinics.findMany({
      ...options,
    });

    return companyClinics.map((companyClinic) => new CompanyClinicsEntity(companyClinic));
  }

  async findFirstNude(options: Prisma.CompanyClinicsFindManyArgs = {}) {
    const companyClinic = await this.prisma.companyClinics.findFirst({
      ...options,
    });

    return new CompanyClinicsEntity(companyClinic);
  }

  async delete(clinicId: string, companyId: string) {
    const companyClinic = await this.prisma.companyClinics.delete({
      where: { companyId_clinicId: { companyId, clinicId } },
    });

    return new CompanyClinicsEntity(companyClinic);
  }
}
