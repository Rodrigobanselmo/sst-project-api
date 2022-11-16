import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';

@Injectable()
export class FindHomogenousGroupByIdService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository) {}

  async execute(id: string, user: UserPayloadDto) {
    const homo = await this.homoGroupRepository.findById(id, user.targetCompanyId);

    return homo;
  }
}
