import { StatusDAO } from '@/@v2/security/status/database/dao/status/status.dao'
import { StatusRepository } from '@/@v2/security/status/database/repositories/status/status.repository'
import { StatusEntity } from '@/@v2/security/status/domain/entities/status.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { IStatusUseCase } from './add-status.types'

@Injectable()
export class AddStatusUseCase {
  constructor(
    private readonly statusRepository: StatusRepository,
    private readonly statusDAO: StatusDAO,
  ) { }

  async execute(params: IStatusUseCase.Params) {
    const exist = await this.statusDAO.checkIfExist(params)
    if (exist) throw new BadRequestException('Item com esse nome já existe')

    const status = new StatusEntity({
      name: params.name,
      color: params.color || null,
      companyId: params.companyId,
      type: params.type,
    })

    await this.statusRepository.create(status)
  }
}
