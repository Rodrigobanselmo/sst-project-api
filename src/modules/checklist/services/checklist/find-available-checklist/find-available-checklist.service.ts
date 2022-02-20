import { Injectable } from '@nestjs/common';
import { ChecklistRepository } from 'src/modules/checklist/repositories/implementations/ChecklistRepository';

@Injectable()
export class FindAvailableChecklistService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  async execute(companyId?: string) {
    const ChecklistFactor = await this.checklistRepository.findAllAvailable(
      companyId,
    );

    return ChecklistFactor;
  }
}
