import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRecMedDto } from 'src/modules/checklist/dto/rec-med.dto';
import { RecMedRepository } from 'src/modules/checklist/repositories/implementations/RecMedRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class UpdateRecMedService {
  constructor(private readonly recMedRepository: RecMedRepository) {}

  async execute(
    id: number,
    updateRecMedDto: UpdateRecMedDto,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;

    const risk = await this.recMedRepository.update(
      {
        id,
        ...updateRecMedDto,
      },
      companyId,
    );

    if (!risk.id) throw new NotFoundException('data not found');

    return risk;
  }
}
