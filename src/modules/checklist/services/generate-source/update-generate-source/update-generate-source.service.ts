import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateGenerateSourceDto } from 'src/modules/checklist/dto/generate-source.dto';
import { GenerateSourceRepository } from 'src/modules/checklist/repositories/implementations/GenerateSourceRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class UpdateGenerateSourceService {
  constructor(
    private readonly generateSourceRepository: GenerateSourceRepository,
  ) {}

  async execute(
    id: number,
    updateGenerateSourceDto: UpdateGenerateSourceDto,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;

    const generateSource = await this.generateSourceRepository.update(
      {
        id,
        ...updateGenerateSourceDto,
      },
      companyId,
    );

    if (!generateSource.id) throw new NotFoundException('data not found');

    return generateSource;
  }
}
