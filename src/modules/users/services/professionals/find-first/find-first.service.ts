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
  }: FindProfessionalsDto) {
    const professionals = await this.professionalRepository.findFirstNude({
      where: {
        OR: [
          {
            AND: [
              { councilId: { equals: councilId } },
              { councilType: { equals: councilType } },
              { councilUF: { equals: councilUF } },
            ],
          },
          { cpf: { equals: cpf } },
        ],
      },
    });

    return professionals;
  }
}
