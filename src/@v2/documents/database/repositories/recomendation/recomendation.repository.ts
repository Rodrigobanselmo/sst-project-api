import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { RecomendationModel } from '../../models/recomendation.model'
import { IRiskRepository } from './recomendation.types'


@Injectable()
export class RecomendationRepository {
  constructor(private readonly prisma: PrismaServiceV2) { }

  static selectOptions() {
    const include = {} satisfies Prisma.RecMedFindFirstArgs['include']

    return { include }
  }

  async findById(params: IRiskRepository.FindByIdParams): IRiskRepository.FindByIdReturn {
    const companyId = '__id__'

    const risk = await this.prisma.recMed.findFirst({
      where: { id: params.id, companyId, recName: { not: null } },
      ...RecomendationRepository.selectOptions()
    })

    return risk ? RecomendationModel.toEntity(risk) : null
  }

  async find(params: IRiskRepository.FindParams): IRiskRepository.FindParamsReturn {
    const companyId = '__id__'

    const risk = await this.prisma.recMed.findMany({
      where: {
        recName: { not: null },
        companyId: companyId,
        riskId: params.riskId
      },
      ...RecomendationRepository.selectOptions()
    })

    return RecomendationModel.toEntities(risk)
  }
}
