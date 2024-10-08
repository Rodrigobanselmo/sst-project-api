import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateChecklistDto } from '../../../dto/update-checklist.dto';
import { ChecklistRepository } from '../../../repositories/implementations/ChecklistRepository';

@Injectable()
export class UpdateChecklistService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  async execute(id: number, updateChecklistDto: UpdateChecklistDto) {
    const Checklist = await this.checklistRepository.update(id, updateChecklistDto);

    if (!Checklist.id) throw new NotFoundException('Checklist not found');

    return Checklist;
  }
}
