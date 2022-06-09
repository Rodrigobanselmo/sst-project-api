import { Injectable, NotFoundException } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';
import { GenerateSourceRepository } from '../../../repositories/implementations/GenerateSourceRepository';

@Injectable()
export class DeleteSoftGenerateSourceService {
  constructor(
    private readonly generateSourceRepository: GenerateSourceRepository,
  ) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const user = isMaster(userPayloadDto);
    const companyId = user.companyId;

    const generateSource = await this.generateSourceRepository.DeleteByIdSoft(
      id,
      companyId,
    );

    if (!generateSource.id) throw new NotFoundException('data not found');

    return generateSource;
  }
}
