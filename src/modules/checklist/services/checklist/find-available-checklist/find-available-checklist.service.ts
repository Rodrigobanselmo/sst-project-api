import { Injectable } from '@nestjs/common';
import { ChecklistRepository } from 'src/modules/checklist/repositories/implementations/ChecklistRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class FindAvailableChecklistService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  async execute(user: UserPayloadDto) {
    const ChecklistFactor = await this.checklistRepository.findAllAvailable(
      user.targetCompanyId,
    );

    return ChecklistFactor;
  }
}