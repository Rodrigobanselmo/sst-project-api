import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { StatusMapper } from '../../mappers/entities/status.mapper'
import { IStatusRepository } from './status.types'


@Injectable()
export class StatusRepository {
  constructor(private readonly prisma: PrismaServiceV2) { }

  static selectOptions() {
    const include = {} satisfies Prisma.StatusFindFirstArgs['include']

    return { include }
  }

  async create(params: IStatusRepository.CreateParams): IStatusRepository.CreateReturn {
    const status = await this.prisma.status.create({
      data: {
        name: params.name,
        type: params.type,
        color: params.color,
        companyId: params.companyId,
      }
    })

    return status ? StatusMapper.toEntity(status) : null
  }

  async update(params: IStatusRepository.UpdateParams): IStatusRepository.UpdateReturn {
    const status = await this.prisma.status.update({
      where: { id: params.id },
      data: {
        name: params.name,
        color: params.color,
        deleted_at: params.deletedAt,
      }
    })

    return status ? StatusMapper.toEntity(status) : null
  }

  async find(params: IStatusRepository.FindParams): IStatusRepository.FindReturn {
    const status = await this.prisma.status.findFirst({
      where: { id: params.id, companyId: params.companyId },
      ...StatusRepository.selectOptions()
    })

    return status ? StatusMapper.toEntity(status) : null
  }
}
