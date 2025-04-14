import { CharacterizationRepository } from '@/@v2/security/characterization/database/repositories/characterization/characterization.repository';
import { EditCharacterizationService } from '@/@v2/security/characterization/services/edit-characterization/edit-characterization.service';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IEditManyCharacterizationUseCase } from './edit-many-characterization.types';

@Injectable()
export class EditManyCharacterizationUseCase {
  constructor(
    private readonly editCharacterizationService: EditCharacterizationService,
    private readonly characterizationRepository: CharacterizationRepository,
  ) {}

  async execute(params: IEditManyCharacterizationUseCase.Params) {
    const characterizations = await asyncBatch({
      items: params.ids,
      batchSize: 10,
      callback: async (id) => {
        const Characterization = await this.editCharacterizationService.update({
          id,
          companyId: params.companyId,
          workspaceId: params.workspaceId,
          stageId: params.stageId,
        });

        if (!Characterization) throw new BadRequestException('Caracterização não encontrado');
        return Characterization;
      },
    });

    await this.characterizationRepository.updateMany(characterizations);
  }
}
