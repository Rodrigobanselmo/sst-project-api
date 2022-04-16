import { Injectable } from '@nestjs/common';
import { CreateGenerateSourceDto } from 'src/modules/checklist/dto/generate-source.dto';
import { GenerateSourceRepository } from 'src/modules/checklist/repositories/implementations/GenerateSourceRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { isMaster } from 'src/shared/utils/isMater';

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
