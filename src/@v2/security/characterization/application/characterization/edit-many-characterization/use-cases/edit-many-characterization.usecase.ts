import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { IEditManyCharacterizationUseCase } from './edit-many-characterization.types';
import { asyncBatch } from '@/@v2/shared/utils/helpers/asyncBatch';
import { CharacterizationRepository } from '@/@v2/security/characterization/database/repositories/characterization/characterization.repository';
import { EditCharacterizationService } from '@/@v2/security/characterization/services/edit-characterization/edit-characterization.service';

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
