import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGenerateSourceDto } from '../../../dto/generate-source.dto';
import { GenerateSourceRepository } from '../../../repositories/implementations/GenerateSourceRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';

@Injectable()
export class CreateGenerateSourceService {
  constructor(private readonly generateSourceRepository: GenerateSourceRepository) {}

  async execute(createGenerateSourceDto: CreateGenerateSourceDto, userPayloadDto: UserPayloadDto, options?: { returnIfExist?: boolean }) {
    const user = isMaster(userPayloadDto);

    const system = user.isSystem && user.companyId === createGenerateSourceDto.companyId;

    if (createGenerateSourceDto.name) {
      const found = await this.generateSourceRepository.find(
        { companyId: createGenerateSourceDto.companyId, search: createGenerateSourceDto.name, riskIds: [createGenerateSourceDto.riskId] },
        { take: 1, skip: 0 },
      );

      if (found.count > 0) {
        if (options.returnIfExist) return found.data[0];
        throw new BadRequestException('Fonte geradora já exite');
      }
    }

    const GenerateSourceFactor = await this.generateSourceRepository.create(createGenerateSourceDto, system);

    return GenerateSourceFactor;
  }
}
