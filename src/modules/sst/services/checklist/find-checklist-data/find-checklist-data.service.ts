import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChecklistRepository } from '../../../repositories/implementations/ChecklistRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { checkIsAvailable } from '../../../../../shared/utils/validators/checkIsAvailable';

@Injectable()
export class FindChecklistDataService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  async execute(checklistId: number, user: UserPayloadDto) {
    if (!checklistId) throw new BadRequestException('Checklist ID is missing');

    const Checklist = await this.checklistRepository.findChecklistData(
      checklistId,
    );

    if (checkIsAvailable(Checklist, user, 'checklist')) return Checklist;

    throw new NotFoundException(`not found`);
  }
}
