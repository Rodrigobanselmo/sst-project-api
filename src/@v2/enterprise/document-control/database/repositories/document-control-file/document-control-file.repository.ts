import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IDocumentControlRepository } from './document-control-file.types';
import { DocumentControlFileEntityMapper } from '../../mappers/entities/document-control-file/document-control-file.model';

@Injectable()
export class DocumentControlFileRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      file: true,
    } satisfies Prisma.DocumentControlFileFindFirstArgs['include'];

    return { include };
  }

  async create(params: IDocumentControlRepository.CreateParams): IDocumentControlRepository.CreateReturn {
    const documentControlFile = await this.prisma.documentControlFile.create({
      data: {
        name: params.name,
        company_id: params.companyId,
        document_control_id: params.documentControlId,
        end_date: params.endDate,
        start_date: params.startDate,
        file_id: params.file.id,
      },
      ...DocumentControlFileRepository.selectOptions(),
    });

    return documentControlFile ? DocumentControlFileEntityMapper.toEntity(documentControlFile) : null;
  }

  async update(params: IDocumentControlRepository.UpdateParams): IDocumentControlRepository.UpdateReturn {
    const documentControlFile = await this.prisma.documentControlFile.update({
      where: {
        id: params.id,
        company_id: params.companyId,
        deleted_at: null,
      },
      data: {
        name: params.name,
        end_date: params.endDate,
        start_date: params.startDate,
        file_id: params.file.id,
      },
      ...DocumentControlFileRepository.selectOptions(),
    });

    return documentControlFile ? DocumentControlFileEntityMapper.toEntity(documentControlFile) : null;
  }

  async find(params: IDocumentControlRepository.FindParams): IDocumentControlRepository.FindReturn {
    const documentControlFile = await this.prisma.documentControlFile.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
        deleted_at: null,
      },
      ...DocumentControlFileRepository.selectOptions(),
    });

    return documentControlFile ? DocumentControlFileEntityMapper.toEntity(documentControlFile) : null;
  }

  async delete(params: IDocumentControlRepository.DeleteParams): Promise<boolean> {
    const documentControlFile = await this.prisma.documentControlFile.update({
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

    return !!documentControlFile;
  }
}
