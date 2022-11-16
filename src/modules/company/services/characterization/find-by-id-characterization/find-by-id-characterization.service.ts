import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CharacterizationRepository } from '../../../repositories/implementations/CharacterizationRepository';

@Injectable()
export class FindByIdCharacterizationService {
  constructor(private readonly characterizationRepository: CharacterizationRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const characterization = await this.characterizationRepository.findById(id, {
      getRiskData: true,
      include: {
        photos: true,
      },
    });

    if (characterization.companyId != userPayloadDto.targetCompanyId) throw new BadRequestException(ErrorCompanyEnum.CHARACTERIZATION_NOT_FOUND);

    return characterization;
  }
}
