/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { CompanyEntity } from '../../entities/company.entity';
import { v4 as uuidV4 } from 'uuid';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { WorkspaceDto } from '../../dto/workspace.dto';
import { WorkspaceEntity } from '../../entities/workspace.entity';

interface IWorkspaceCompany extends WorkspaceDto {
  companyId?: string;
}

@Injectable()
export class WorkspaceRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    address,
    companyId,
    ...workspaceDto
  }: IWorkspaceCompany): Promise<CompanyEntity> {
    const company = await this.prisma.workspace.create({
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

    return new CompanyEntity(company);
  }

  async findByCompany(companyId: string) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { companyId },
    });

    return [...workspaces.map((workspace) => new WorkspaceEntity(workspace))];
  }
}
