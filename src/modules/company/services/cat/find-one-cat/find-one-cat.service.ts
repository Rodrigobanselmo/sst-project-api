import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CatRepository } from '../../../repositories/implementations/CatRepository';

@Injectable()
export class FindOneCatsService {
  constructor(private readonly catRepository: CatRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const access = await this.catRepository.findById({ companyId: user.targetCompanyId, id });

    return access;
  }
}
