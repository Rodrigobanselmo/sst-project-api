/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { WorkspaceDto } from '../../dto/workspace.dto';
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
}
