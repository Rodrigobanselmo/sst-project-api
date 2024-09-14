import { Injectable } from '@nestjs/common'
import { IRiskUseCase } from './generate-pgr.types'
import { RiskRepository } from '@/@v2/security/database/repositories/risk/risk.repository'

@Injectable()
export class RiskUseCase {
  constructor(
    private readonly riskRepository: RiskRepository
  ) { }

  async read(params: IRiskUseCase.Params) {
    params
    this.riskRepository
    // const risk = await this.riskRepository.findById({
    //   id: params.riskId,
    //   companyId: '1'
    // })

  }
}
