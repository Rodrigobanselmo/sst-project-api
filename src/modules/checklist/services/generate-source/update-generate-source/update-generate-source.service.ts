import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateGenerateSourceDto } from 'src/modules/checklist/dto/generate-source.dto';
import { GenerateSourceRepository } from 'src/modules/checklist/repositories/implementations/GenerateSourceRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { isMaster } from 'src/shared/utils/isMater';

@Injectable()
export class UpdateGenerateSourceService {
  constructor(
    private readonly generateSourceRepository: GenerateSourceRepository,
  ) {}

  async execute(
    id: number,
    updateGenerateSourceDto: UpdateGenerateSourceDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const user = isMaster(userPayloadDto);
    const companyId = user.targetCompanyId;

    const system =
      user.isMaster && user.companyId === updateGenerateSourceDto.companyId;

    const generateSource = await this.generateSourceRepository.findById(
      id,
      companyId,
    );

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

    if (!generateSourceUpdated.id)
      throw new NotFoundException('data not found');

    return generateSourceUpdated;
  }
}
