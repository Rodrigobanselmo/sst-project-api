import { FindScheduleMedicalVisitDto } from './../../../dto/scheduleMedicalVisit.dto';
import { ScheduleMedicalVisitRepository } from './../../../repositories/implementations/ScheduleMedicalVisitRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindScheduleMedicalVisitsService {
  constructor(private readonly scheduleMedicalVisitRepository: ScheduleMedicalVisitRepository) {}

  async execute({ skip, take, ...query }: FindScheduleMedicalVisitDto, user: UserPayloadDto) {
    const access = await this.scheduleMedicalVisitRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
    );

    return access;
  }
}
