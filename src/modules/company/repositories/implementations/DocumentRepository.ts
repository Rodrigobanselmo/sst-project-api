import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import {
  CreateDocumentDto,
  FindDocumentDto,
  UpdateDocumentDto,
} from '../../dto/document.dto';

import { DocumentEntity } from '../../entities/document.entity';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';

@Injectable()
export class DocumentRepository {
  constructor(private prisma: PrismaService) {}

  async create({ ...createCompanyDto }: CreateDocumentDto) {
    const document = await this.prisma.document.create({
      data: createCompanyDto,
    });

    return new DocumentEntity(document);
  }

  async update({ id, companyId, ...createCompanyDto }: UpdateDocumentDto) {
    const document = await this.prisma.document.update({
      data: createCompanyDto,
      where: { id_companyId: { companyId, id } },
    });

    return new DocumentEntity(document);
  }

  async find(
    query: Partial<FindDocumentDto>,
    pagination: PaginationQueryDto,
    options: Prisma.DocumentFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.document.count({
        where,
      }),
      this.prisma.document.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { endDate: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((document) => new DocumentEntity(document)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.DocumentFindManyArgs = {}) {
    const documents = await this.prisma.document.findMany({
      ...options,
    });

    return documents.map((document) => new DocumentEntity(document));
  }

  async findFirstNude(options: Prisma.DocumentFindFirstArgs = {}) {
    const document = await this.prisma.document.findFirst({
      ...options,
    });

    return new DocumentEntity(document);
  }

  async delete(id: number, companyId: string) {
    const document = await this.prisma.document.delete({
      where: { id_companyId: { companyId, id } },
    });

    return new DocumentEntity(document);
  }
}
