import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChecklistRepository } from 'src/modules/checklist/repositories/implementations/ChecklistRepository';

@Injectable()
export class FindChecklistDataService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  async execute(checklistId: number, companyId?: string) {
    if (!checklistId) throw new BadRequestException('Checklist ID is missing');

    const Checklist = await this.checklistRepository.findChecklistData(
      checklistId,
    );

    if (!Checklist.id) throw new NotFoundException('Checklist not found');

    if (Checklist.system) return Checklist;

    if (!companyId) throw new BadRequestException('Company ID is missing');

    if (Checklist.companyId !== companyId)
      throw new ForbiddenException(
        'You are not allowed to access this checklist',
      );

    return Checklist;
  }
}
