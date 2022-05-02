import { Injectable } from '@nestjs/common';
import { FindEpiDto } from 'src/modules/checklist/dto/epi.dto';

import { EpiRepository } from '../../../repositories/implementations/EpiRepository';

@Injectable()
export class FindEpiService {
  constructor(private readonly epiRepository: EpiRepository) {}

  async execute({ skip, take, ...query }: FindEpiDto) {
    const Epi = await this.epiRepository.find(query, { skip, take });

    return Epi;
  }
}
