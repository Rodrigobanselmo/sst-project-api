import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFileRepository } from './file.types';
import { FileEntityMapper } from '../../mappers/file.model';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static whereUnusedFilter() {
    const beforeOneDay = new Date(new Date().setDate(new Date().getDate() - 1));
    const where = {
      should_delete: true,
      deleted_at: null,
      created_at: {
        lte: beforeOneDay,
      },
    } satisfies Prisma.SystemFileWhereInput;

    return where;
  }

  static selectOptions() {
    const include = {} satisfies Prisma.SystemFileFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFileRepository.CreateParams): IFileRepository.CreateReturn {
    const fileEntity = await this.prisma.systemFile.create({
      data: {
        name: params.name,
        company_id: params.companyId,
        bucket: params.bucket,
        key: params.key,
        url: params.url,
        should_delete: params.shouldDelete,
        size: params.size,
        metadata: params.metadata,
      },
    });

    return fileEntity ? FileEntityMapper.toEntity(fileEntity) : null;
  }

  async update(params: IFileRepository.UpdateParams): IFileRepository.UpdateReturn {
    const fileEntity = await this.prisma.systemFile.update({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      data: {
        name: params.name,
        company_id: params.companyId,
        bucket: params.bucket,
        key: params.key,
        url: params.url,
        should_delete: params.shouldDelete,
      },
    });

    return fileEntity ? FileEntityMapper.toEntity(fileEntity) : null;
  }

  async find(params: IFileRepository.FindParams): IFileRepository.FindReturn {
    const fileEntity = await this.prisma.systemFile.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
    });

    return fileEntity ? FileEntityMapper.toEntity(fileEntity) : null;
  }

  async findMany(params?: IFileRepository.FindManyParams): IFileRepository.FindManyReturn {
    const files = await this.prisma.systemFile.findMany({
      where: {
        company_id: params?.companyId,
        ...FileRepository.whereUnusedFilter(),
      },
    });

    return FileEntityMapper.toArray(files);
  }

  async delete(params: IFileRepository.DeleteParams): Promise<void> {
    await this.prisma.systemFile.update({
      select: { id: true },
      data: {
        deleted_at: new Date(),
      },
      where: {
        id: params.id,
        company_id: params.companyId,
        deleted_at: null,
      },
    });
  }
}
