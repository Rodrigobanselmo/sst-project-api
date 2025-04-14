import { Injectable } from '@nestjs/common';
import { IEditCharacterizationService } from './edit-characterization.service.types';
import { CharacterizationRepository } from '../../database/repositories/characterization/characterization.repository';

@Injectable()
export class EditCharacterizationService {
  constructor(private readonly characterizationRepository: CharacterizationRepository) {}

  async update(params: IEditCharacterizationService.Params) {
    const characterization = await this.characterizationRepository.findById({
      id: params.id,
      companyId: params.companyId,
      workspaceId: params.workspaceId,
    });

    if (!characterization) return null;

    characterization.stageId = params.stageId || null;

    return characterization;
  }
}
