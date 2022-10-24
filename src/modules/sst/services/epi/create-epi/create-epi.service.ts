import { Injectable } from '@nestjs/common';

import { CreateEpiDto } from '../../../dto/epi.dto';
import { EpiRepository } from '../../../repositories/implementations/EpiRepository';

@Injectable()
export class CreateEpiService {
  constructor(private readonly epiRepository: EpiRepository) {}

  async execute(createEpiDto: CreateEpiDto) {
    const EpiFactor = await this.epiRepository.create(createEpiDto);

    return EpiFactor;
  }
}
