import { Injectable } from '@nestjs/common';

import { UpdateEpiDto } from '../../../dto/epi.dto';
import { EpiRepository } from '../../../repositories/implementations/EpiRepository';

@Injectable()
export class UpdateEpiService {
  constructor(private readonly epiRepository: EpiRepository) {}

  async execute(id: number, updateEpiDto: UpdateEpiDto) {
    const epi = await this.epiRepository.update({
      id,
      ...updateEpiDto,
    });

    return epi;
  }
}
