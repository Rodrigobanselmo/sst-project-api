import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { FindWorkspaceDto, WorkspaceDto } from '../../dto/workspace.dto';
import { WorkspaceEntity } from '../../entities/workspace.entity';

interface IWorkspaceCompany extends WorkspaceDto {
  companyId?: string;
}

@Injectable()
export class WorkspaceRepository {
  constructor(private prisma: PrismaService) {}

  async create({ address, companyId, ...workspaceDto }: IWorkspaceCompany): Promise<WorkspaceEntity> {
    const workspace = await this.prisma.workspace.create({
      data: {
        ...workspaceDto,
        companyId: companyId,
        address: address
          ? {
              create: { ...address },
            }
          : undefined,
      },
      include: {
        address: true,
      },
    });

    return new WorkspaceEntity(workspace as any);
  }

  async findById(id: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: { address: true },
    });

    return new WorkspaceEntity(workspace);
  }

  async update(id: string, data: Partial<WorkspaceDto>) {
    const workspace = await this.prisma.workspace.update({
      where: { id },
      data: data as any,
      include: { address: true },
    });

    return new WorkspaceEntity(workspace);
  }

  async findByCompany(companyId: string) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { companyId },
    });

    return [...workspaces.map((workspace) => new WorkspaceEntity(workspace))];
  }

  async findNude(options: Prisma.WorkspaceFindManyArgs = {}) {
    const workspaces = await this.prisma.workspace.findMany({
      ...options,
    });

    return [...workspaces.map((workspace) => new WorkspaceEntity(workspace))];
  }

  async find(query: Partial<FindWorkspaceDto>, pagination: PaginationQueryDto, options: Prisma.WorkspaceFindManyArgs = {}) {
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

    if ('search' in query && query.search) {
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
      this.prisma.workspace.count({
        where,
      }),
      this.prisma.workspace.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((contact) => new WorkspaceEntity(contact)),
      count: response[0],
    };
  }
}
