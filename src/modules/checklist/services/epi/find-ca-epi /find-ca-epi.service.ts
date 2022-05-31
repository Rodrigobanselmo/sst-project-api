import { Injectable, NotFoundException } from '@nestjs/common';
import { ErrorChecklistEnum } from '../../../../../shared/constants/enum/errorMessage';

import { EpiRepository } from '../../../repositories/implementations/EpiRepository';

@Injectable()
export class FindByCAEpiService {
  constructor(private readonly epiRepository: EpiRepository) {}

  async execute(ca: string) {
    const EpiFactor = await this.epiRepository.findByCA(ca);

    if (!EpiFactor?.ca) {
      throw new NotFoundException(ErrorChecklistEnum.EPI_NOT_FOUND);
    }

    return EpiFactor;
  }
}
