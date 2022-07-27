import { Injectable } from '@nestjs/common';
import { CreateRecMedDto } from '../../../../../modules/checklist/dto/rec-med.dto';
import { RecMedRepository } from '../../../../../modules/checklist/repositories/implementations/RecMedRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';

@Injectable()
export class CreateRecMedService {
  constructor(private readonly recMedRepository: RecMedRepository) {}

  async execute(
    createRecMedDto: CreateRecMedDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const user = isMaster(userPayloadDto, createRecMedDto.companyId);

    const system =
      user.isSystem && user.companyId === createRecMedDto.companyId;

    const RecMedFactor = await this.recMedRepository.create(
      createRecMedDto,
      system,
    );

    return RecMedFactor;
  }
}
