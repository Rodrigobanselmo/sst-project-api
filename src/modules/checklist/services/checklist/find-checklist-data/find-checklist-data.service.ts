import { BadRequestException, Injectable } from '@nestjs/common';
import { ChecklistRepository } from 'src/modules/checklist/repositories/implementations/ChecklistRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { checkIsAvailable } from 'src/shared/utils/validators/checkIsAvailable';

@Injectable()
export class FindChecklistDataService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  async execute(checklistId: number, user: UserPayloadDto) {
    if (!checklistId) throw new BadRequestException('Checklist ID is missing');

    const Checklist = await this.checklistRepository.findChecklistData(
      checklistId,
    );

    return checkIsAvailable(Checklist, user);
  }
}
