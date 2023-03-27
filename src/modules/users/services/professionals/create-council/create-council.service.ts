import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateCouncilDto } from '../../../../../modules/users/dto/council.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ProfessionalRepository } from '../../../repositories/implementations/ProfessionalRepository';
import { UpdateProfessionalService } from '../update-professional/update-professional.service';

@Injectable()
export class CreateCouncilService {
  constructor(private readonly professionalRepository: ProfessionalRepository, private readonly updateProfessionalService: UpdateProfessionalService) {}

  async execute(createDataDto: CreateCouncilDto, user: UserPayloadDto) {
    await this.updateProfessionalService.checkIfCanUpdateProfessional(createDataDto.professionalId, user);

    if (
      !(
        (createDataDto.councilId && createDataDto.councilType && createDataDto.councilUF) ||
        (createDataDto.councilId == '' && createDataDto.councilType == '' && createDataDto.councilUF == '')
      )
    ) {
      throw new BadRequestException('Dados inválidos para cadastro');
    }

    const council = await this.professionalRepository.createCouncil(createDataDto);

    return council;
  }
}
