import { Injectable } from '@nestjs/common';

import { FindProfessionalsDto } from '../../../dto/professional.dto';
import { ProfessionalRepository } from '../../../repositories/implementations/ProfessionalRepository';

@Injectable()
export class FindFirstProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}
  async execute({
    councilId,
    councilType,
    councilUF,
    cpf,
    email,
  }: FindProfessionalsDto) {
    const professionals = await this.professionalRepository.findFirstNude({
      where: {
        OR: [
          {
            AND: [
              { councilId: { equals: councilId || 'not-found' } },
              { councilType: { equals: councilType || 'not-found' } },
              { councilUF: { equals: councilUF || 'not-found' } },
            ],
          },
          { cpf: { equals: cpf || 'not-found' } },
          { user: { email: { equals: email || 'not-found' } } },
          { email: { equals: email || 'not-found' } },
        ],
      },
    });

    return professionals;
  }
}
