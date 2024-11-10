import { StatusRepository } from '@/@v2/security/status/database/repositories/status/status.repository'
import { BadRequestException, Injectable } from '@nestjs/common'
import { IStatusUseCase } from './edit-status.types'

@Injectable()
export class EditStatusUseCase {
  constructor(
    private readonly statusRepository: StatusRepository,
  ) { }

  async execute(params: IStatusUseCase.Params) {
    const status = await this.statusRepository.find({ id: params.id, companyId: params.companyId })
    if (!status) throw new BadRequestException('Item não encontrado')

    status.update(params)

    await this.statusRepository.update(status)
  }
}
