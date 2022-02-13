import { Injectable } from '@nestjs/common';
import { CreateChecklistDto } from 'src/modules/checklist/dto/create-checklist.dto';
import { ChecklistRepository } from 'src/modules/checklist/repositories/implementations/ChecklistRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { isMaster } from 'src/shared/utils/isMater';

@Injectable()
export class CreateChecklistService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  async execute(
    createChecklistDto: CreateChecklistDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const user = isMaster(userPayloadDto);

    const system =
      user.isMaster && user.companyId === createChecklistDto.companyId;

    const ChecklistFactor = await this.checklistRepository.create(
      createChecklistDto,
      system,
    );

    return ChecklistFactor;
  }
}
