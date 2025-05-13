import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IStatusDAO } from './status.types';
import { StatusBrowseModelMapper } from '../../mappers/models/status/status-browse.mapper';

@Injectable()
export class StatusDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ companyId, type }: IStatusDAO.BrowseParams) {
    const status = await this.prisma.status.findMany({
      where: {
        companyId,
        type,
        deleted_at: null,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return StatusBrowseModelMapper.toModel({ results: status });
  }

  async checkIfExist({ name, companyId, type }: IStatusDAO.CheckIfExistParams) {
    const status = await this.prisma.status.findFirst({
      where: {
        name,
        companyId,
        type,
        deleted_at: null,
      },
    });

    return !!status;
  }
}
