import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import {
  CreateContactDto,
  FindContactDto,
  UpdateContactDto,
} from '../../dto/contact.dto';

import { ContactEntity } from '../../entities/contact.entity';
import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';

@Injectable()
export class ContactRepository {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateContactDto) {
    const contact = await this.prisma.contact.create({
      data: createCompanyDto,
    });

    return new ContactEntity(contact);
  }

  async update({ id, companyId, ...createCompanyDto }: UpdateContactDto) {
    const contact = await this.prisma.contact.update({
      data: createCompanyDto,
      where: { id_companyId: { companyId, id } },
    });

    return new ContactEntity(contact);
  }

  async findAllByCompany(
    query: Partial<FindContactDto>,
    pagination: PaginationQueryDto,
    options: Prisma.ContactFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [
        // {
        //   OR: [
        //     { companyId: query.companyId },
        //     {
        //       company: {
        //         group: { companies: { some: { companyId: query.companyId } } },
        //       },
        //     },
        //   ],
        // },
      ],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'companiesIds'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
      delete query.search;
    }

    if ('companiesIds' in query) {
      (where.AND as any).push({
        companyId: { in: query.companiesIds },
      } as typeof options.where);
      delete query.companiesIds;
    }

    const response = await this.prisma.$transaction([
      this.prisma.contact.count({
        where,
      }),
      this.prisma.contact.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { isPrincipal: 'desc' },
      }),
    ]);

    return {
      data: response[1].map((contact) => new ContactEntity(contact)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.ContactFindManyArgs = {}) {
    const contacts = await this.prisma.contact.findMany({
      ...options,
    });

    return contacts.map((contact) => new ContactEntity(contact));
  }

  async findFirstNude(options: Prisma.ContactFindFirstArgs = {}) {
    const contact = await this.prisma.contact.findFirst({
      ...options,
    });

    return new ContactEntity(contact);
  }

  async delete(id: number, companyId: string) {
    const contact = await this.prisma.contact.delete({
      where: { id_companyId: { companyId, id } },
    });

    return new ContactEntity(contact);
  }
}
