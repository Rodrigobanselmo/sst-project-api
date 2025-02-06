import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IDocumentControlAggregateRepository } from './document-control-aggregate.types';
import { DocumentControlAggregateMapper } from '../../mappers/aggregates/document-control/document-control.model';
import { DocumentControlFileRepository } from '../document-control-file/document-control-file.repository';

@Injectable()
export class DocumentControlAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      document_control_files: {
        ...DocumentControlFileRepository.selectOptions(),
      },
    } satisfies Prisma.DocumentControlFindFirstArgs['include'];

    return { include };
  }

  async create(params: IDocumentControlAggregateRepository.CreateParams): IDocumentControlAggregateRepository.CreateReturn {
    const documentControl = await this.prisma.documentControl.create({
      data: {
        name: params.documentControl.name,
        company_id: params.documentControl.companyId,
        type: params.documentControl.type,
        description: params.documentControl.description,
        status: params.documentControl.status,
        workspace_id: params.documentControl.workspaceId,
        document_control_files: {
          createMany: {
            data: params.files.map((file) => ({
              name: file.name,
              company_id: file.companyId,
              file_id: file.file.id,
              end_date: file.endDate,
              start_date: file.startDate,
            })),
          },
        },
      },
      ...DocumentControlAggregateRepository.selectOptions(),
    });

    return documentControl ? DocumentControlAggregateMapper.toAggregate(documentControl) : null;
  }

  async update(params: IDocumentControlAggregateRepository.UpdateParams): IDocumentControlAggregateRepository.UpdateReturn {
    const documentControl = await this.prisma.documentControl.update({
      where: {
        id: params.documentControl.id,
        company_id: params.documentControl.companyId,
      },
      data: {
        name: params.documentControl.name,
        type: params.documentControl.type,
        description: params.documentControl.description,
        status: params.documentControl.status,
      },
      ...DocumentControlAggregateRepository.selectOptions(),
    });

    return documentControl ? DocumentControlAggregateMapper.toAggregate(documentControl) : null;
  }

  async find(params: IDocumentControlAggregateRepository.FindParams): IDocumentControlAggregateRepository.FindReturn {
    const documentControl = await this.prisma.documentControl.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      ...DocumentControlAggregateRepository.selectOptions(),
    });

    return documentControl ? DocumentControlAggregateMapper.toAggregate(documentControl) : null;
  }

  async delete(params: IDocumentControlAggregateRepository.DeleteParams): Promise<void> {
    await this.prisma.documentControl.delete({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
    });
  }
}
