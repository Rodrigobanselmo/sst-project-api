import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateDocumentModelDto, UpdateDocumentModelDto, FindDocumentModelDto } from '../../dto/document-model.dto';
import { IDocumentModelData } from '../../types/document-mode.types';
import { DocumentModelEntity } from './../../entities/document-model.entity';

@Injectable()
export class DocumentModelRepository {
  constructor(private prisma: PrismaService) { }

  async create({ data, ...props }: CreateDocumentModelDto & { data: IDocumentModelData; system?: boolean }) {
    const buffer = Buffer.from(JSON.stringify(data), 'utf8');
    const document = await this.prisma.documentModel.create({
      data: { data: buffer, ...props },
    });

    return new DocumentModelEntity(document);
  }

  async update({ id, data, ...props }: UpdateDocumentModelDto) {
    let buffer = undefined;
    if (data) {
      buffer = Buffer.from(JSON.stringify(data), 'utf8');
    }

    const document = await this.prisma.documentModel.update({
      data: { data: buffer, ...props },
      where: { id },
      select: { id: true },
    });

    return new DocumentModelEntity(document);
  }

  async find(query: Partial<FindDocumentModelDto>, pagination: PaginationQueryDto, options: Prisma.DocumentModelFindManyArgs = {}) {
    const whereInit = {
      AND: [
        {
          OR: [
            { system: true, status: 'ACTIVE' },
            {
              companyId: query.companyId,
            },
            {
              company: { applyingServiceContracts: { some: { receivingServiceCompanyId: query.companyId, status: 'ACTIVE' } } },
            },
            ...(query.all ? [{ company: { receivingServiceContracts: { some: { applyingServiceCompanyId: query.companyId } } } }] : []),
          ],
        },
      ],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['showInactive', 'companyId', 'all', 'search'],
    });

    if (!options.select)
      options.select = {
        id: true,
        status: true,
        companyId: true,
        description: true,
        name: true,
        type: true,
        created_at: true,
      };

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }, { description: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
      delete query.search;
    }

    if (!('showInactive' in query)) {
      (where.AND as any).push({
        status: 'ACTIVE',
      } as typeof options.where);
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.documentModel.count({
        where,
      }),
      this.prisma.documentModel.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((document) => new DocumentModelEntity(document)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.DocumentModelFindManyArgs = {}) {
    const documents = await this.prisma.documentModel.findMany({
      ...options,
    });

    return documents.map((document) => new DocumentModelEntity(document));
  }

  async findFirstNude(options: Prisma.DocumentModelFindFirstArgs = {}) {
    const document = await this.prisma.documentModel.findFirst({
      ...options,
    });

    return new DocumentModelEntity(document);
  }

  async delete(id: number, companyId: string) {
    const document = await this.prisma.documentModel.update({
      data: { status: 'INACTIVE' },
      where: { id_companyId: { companyId, id } },
    });

    return new DocumentModelEntity(document);
  }
}
