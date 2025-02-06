import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IDocumentControlRepository } from './document-control.types';
import { DocumentControlEntityMapper } from '../../mappers/entities/document-control/document-control.model';

@Injectable()
export class DocumentControlRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.DocumentControlFindFirstArgs['include'];

    return { include };
  }

  async create(params: IDocumentControlRepository.CreateParams): IDocumentControlRepository.CreateReturn {
    const documentControlEntity = await this.prisma.documentControl.create({
      data: {
        name: params.name,
        company_id: params.companyId,
        type: params.type,
        description: params.description,
        status: params.status,
        workspace_id: params.workspaceId,
      },
    });

    return documentControlEntity ? DocumentControlEntityMapper.toEntity(documentControlEntity) : null;
  }

  async update(params: IDocumentControlRepository.UpdateParams): IDocumentControlRepository.UpdateReturn {
    const documentControlEntity = await this.prisma.documentControl.update({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      data: {
        name: params.name,
        type: params.type,
        description: params.description,
        status: params.status,
      },
    });

    return documentControlEntity ? DocumentControlEntityMapper.toEntity(documentControlEntity) : null;
  }

  async find(params: IDocumentControlRepository.FindParams): IDocumentControlRepository.FindReturn {
    const documentControlEntity = await this.prisma.documentControl.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
    });

    return documentControlEntity ? DocumentControlEntityMapper.toEntity(documentControlEntity) : null;
  }

  async findMany(params?: IDocumentControlRepository.FindManyParams): IDocumentControlRepository.FindManyReturn {
    const documentControls = await this.prisma.documentControl.findMany({
      where: {
        company_id: params?.companyId,
      },
    });

    return DocumentControlEntityMapper.toArray(documentControls);
  }

  async delete(params: IDocumentControlRepository.DeleteParams): Promise<boolean> {
    const deleted = await this.prisma.documentControl.update({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      data: {
        deleted_at: new Date(),
      },
      select: {
        id: true,
      },
    });

    return !!deleted;
  }
}
