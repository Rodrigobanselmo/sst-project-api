import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateGenerateSourceDto } from '../../../dto/generate-source.dto';
import { GenerateSourceRepository } from '../../../repositories/implementations/GenerateSourceRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';

@Injectable()
export class UpdateGenerateSourceService {
  constructor(private readonly generateSourceRepository: GenerateSourceRepository) {}

  async execute(id: string, updateGenerateSourceDto: UpdateGenerateSourceDto, userPayloadDto: UserPayloadDto) {
    const user = isMaster(userPayloadDto, updateGenerateSourceDto.companyId);
    const companyId = user.companyId;

    const system = user.isSystem && user.companyId === updateGenerateSourceDto.companyId;

    const generateSource = await this.generateSourceRepository.findById(id, companyId);

    if (!generateSource?.id) throw new NotFoundException('data not found');

    const generateSourceUpdated = await this.generateSourceRepository.update(
      {
        id,
        riskId: generateSource.riskId,
        ...updateGenerateSourceDto,
      },
      system,
      companyId,
    );

    if (!generateSourceUpdated.id) throw new NotFoundException('data not found');

    return generateSourceUpdated;
  }
}
