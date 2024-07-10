import { Injectable } from '@nestjs/common';

import { ProfessionalRepository } from '../../../repositories/implementations/ProfessionalRepository';
import { UpdateProfessionalService } from '../update-professional/update-professional.service';

@Injectable()
export class DeleteCouncilService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
    private readonly updateProfessionalService: UpdateProfessionalService,
  ) {}

  async execute(id: number, professionalId: number) {
    await this.professionalRepository.deleteCouncil(id, professionalId);
  }
}
