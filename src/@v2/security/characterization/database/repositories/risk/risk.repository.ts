import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { RiskMapper } from '../../mappers/entities/risk.mapper'
import { IRiskRepository } from './risk.types'
import { RecomendationRepository } from '../recomendation/recomendation.repository'


@Injectable()
export class RiskRepository {
  private aggregations = (riskId: string) => ({
    recomendations: () => this.recomendationRepository.find({ riskId })
  })

  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly recomendationRepository: RecomendationRepository
  ) { }

  static selectOptions() {
    const include = {} satisfies Prisma.RiskFactorsFindFirstArgs['include']

    return { include }
  }

  async findById(params: IRiskRepository.FindByIdParams): IRiskRepository.FindByIdReturn {
    const risk = await this.prisma.riskFactors.findUnique({
      where: { id_companyId: { id: params.id, companyId: params.companyId } },
      ...RiskRepository.selectOptions()
    })

    return risk ? RiskMapper.toAggregate({ ...risk, ...this.aggregations(risk.id) }) : null
  }


}
