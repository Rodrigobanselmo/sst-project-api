import { Injectable } from '@nestjs/common';

import { UpdatePhotoEnvironmentDto } from '../../../dto/environment.dto';
import { EnvironmentPhotoRepository } from '../../../repositories/implementations/EnvironmentPhotoRepository';
import { EnvironmentRepository } from '../../../repositories/implementations/EnvironmentRepository';

@Injectable()
export class UpdateEnvironmentPhotoService {
  constructor(
    private readonly environmentRepository: EnvironmentRepository,
    private readonly environmentPhotoRepository: EnvironmentPhotoRepository,
  ) {}

  async execute(
    id: string,
    updatePhotoEnvironmentDto: UpdatePhotoEnvironmentDto,
  ) {
    const environmentPhoto = await this.environmentPhotoRepository.update({
      ...updatePhotoEnvironmentDto,
      id,
    });

    const environmentData = await this.environmentRepository.findById(
      environmentPhoto.companyEnvironmentId,
    );

    return environmentData;
  }
}
