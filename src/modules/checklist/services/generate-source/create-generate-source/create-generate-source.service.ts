import { Injectable } from '@nestjs/common';
import { CreateGenerateSourceDto } from '../../../../../modules/checklist/dto/generate-source.dto';
import { GenerateSourceRepository } from '../../../../../modules/checklist/repositories/implementations/GenerateSourceRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';

@Injectable()
export class CreateGenerateSourceService {
  constructor(
    private readonly generateSourceRepository: GenerateSourceRepository,
  ) {}

  async execute(
    createGenerateSourceDto: CreateGenerateSourceDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const user = isMaster(userPayloadDto);

    const system =
      user.isMaster && user.companyId === createGenerateSourceDto.companyId;

    const GenerateSourceFactor = await this.generateSourceRepository.create(
      createGenerateSourceDto,
      system,
    );

    return GenerateSourceFactor;
  }
}
