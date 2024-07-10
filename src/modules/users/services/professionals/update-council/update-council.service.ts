import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateCouncilDto } from '../../../dto/council.dto';
import { ProfessionalRepository } from '../../../repositories/implementations/ProfessionalRepository';
import { UpdateProfessionalService } from '../update-professional/update-professional.service';

@Injectable()
export class UpdateCouncilService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
    private readonly updateProfessionalService: UpdateProfessionalService,
  ) {}

  async execute(body: UpdateCouncilDto, user: UserPayloadDto) {
    await this.updateProfessionalService.checkIfCanUpdateProfessional(body.professionalId, user, [body.id]);

    if (
      !(
        (body.councilId && body.councilType && body.councilUF) ||
        (body.councilId == '' && body.councilType == '' && body.councilUF == '')
      )
    ) {
      throw new BadRequestException('Dados inválidos para cadastro');
    }

    const council = await this.professionalRepository.updateCouncil(body);

    return council;
  }
}
