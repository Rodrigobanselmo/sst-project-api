import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ScheduleMedicalVisitRepository } from '../../../repositories/implementations/ScheduleMedicalVisitRepository';

@Injectable()
export class FindOneScheduleMedicalVisitsService {
  constructor(private readonly scheduleMedicalVisitRepository: ScheduleMedicalVisitRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const visit = await this.scheduleMedicalVisitRepository.findById({ companyId: user.targetCompanyId, id });

    return visit;
  }
}
