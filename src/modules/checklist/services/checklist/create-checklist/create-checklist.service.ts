import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChecklistDto } from '../../../../../modules/checklist/dto/create-checklist.dto';
import { ChecklistRepository } from '../../../../../modules/checklist/repositories/implementations/ChecklistRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class CreateChecklistService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  async execute(createChecklistDto: CreateChecklistDto, user: UserPayloadDto) {
    if (!createChecklistDto.data)
      throw new BadRequestException('Data is missing');

    const system = user.isMaster;

    const ChecklistFactor = await this.checklistRepository.create(
      { ...createChecklistDto },
      system,
    );

    return ChecklistFactor;
  }
}
