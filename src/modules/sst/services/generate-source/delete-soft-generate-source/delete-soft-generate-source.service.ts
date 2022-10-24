import { Injectable, NotFoundException } from '@nestjs/common';
import { GenerateSourceEntity } from '../../../entities/generateSource.entity';

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

    let generateSource: GenerateSourceEntity;
    if (user.isMaster) {
      generateSource = await this.generateSourceRepository.DeleteByIdSoft(id);
    } else {
      generateSource =
        await this.generateSourceRepository.DeleteByCompanyAndIdSoft(
          id,
          companyId,
        );
    }

    if (!generateSource.id) throw new NotFoundException('data not found');

    return generateSource;
  }
}
