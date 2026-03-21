import { ErrorMessageEnum } from './../../../../../shared/constants/enum/errorMessage';
import { HomoGroupRepository } from './../../../repositories/implementations/HomoGroupRepository';
import { CharacterizationPhotoRepository } from './../../../repositories/implementations/CharacterizationPhotoRepository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';
import { DeleteHomoGroupService } from '../../homoGroup/delete-homo-group/delete-homo-group.service';

@Injectable()
export class DeleteCharacterizationService {
  constructor(
    private readonly characterizationRepository: CharacterizationRepository,
    private readonly characterizationPhotoRepository: CharacterizationPhotoRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly deleteHomoGroupService: DeleteHomoGroupService,
  ) {}

  async execute(id: string, workspaceId: string, userPayloadDto: UserPayloadDto) {
    await this.deleteHomoGroupService.checkDeletion(id, userPayloadDto);
    const photos = await this.characterizationPhotoRepository.findByCharacterization(id);

    // Remove apenas vínculos no banco; arquivos permanecem no S3 (alinhado à exclusão individual de foto).
    await Promise.all(photos.map((photo) => this.characterizationPhotoRepository.delete(photo.id)));

    const characterizations = await this.characterizationRepository.findById(id);

    if (characterizations.companyId !== userPayloadDto.targetCompanyId) {
      throw new BadRequestException(ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE);
    }

    characterizations.profiles.forEach(async (profile) => {
      await this.characterizationRepository.delete(profile.id, userPayloadDto.targetCompanyId, workspaceId);
      await this.homoGroupRepository.deleteById(profile.id);
    });

    await this.characterizationRepository.delete(id, userPayloadDto.targetCompanyId, workspaceId);
    await this.homoGroupRepository.deleteById(id);

    return characterizations;
  }
}
