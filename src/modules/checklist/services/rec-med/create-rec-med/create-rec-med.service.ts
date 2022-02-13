import { Injectable } from '@nestjs/common';
import { CreateRecMedDto } from 'src/modules/checklist/dto/create-rec-med.dto';
import { RecMedRepository } from 'src/modules/checklist/repositories/implementations/RecMedRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { isMaster } from 'src/shared/utils/isMater';

@Injectable()
export class CreateRecMedService {
  constructor(private readonly recMedRepository: RecMedRepository) {}

  async execute(
    createRecMedDto: CreateRecMedDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const user = isMaster(userPayloadDto);

    const system =
      user.isMaster && user.companyId === createRecMedDto.companyId;

    const RecMedFactor = await this.recMedRepository.create(
      createRecMedDto,
      system,
    );

    return RecMedFactor;
  }
}
