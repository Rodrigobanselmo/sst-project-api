import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { UpdateProfessionalResponsibleDto } from './../../../dto/professional-responsible.dto';
import { ProfessionalResponsibleRepository } from './../../../repositories/implementations/ProfessionalResponsibleRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateProfessionalResponsibleService {
  constructor(
    private readonly professionalCouncilResponsibleRepository: ProfessionalResponsibleRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
  ) {}

  async execute(UpsertProfessionalCouncilResponsibleDto: UpdateProfessionalResponsibleDto, user: UserPayloadDto) {
    const professionalCouncilResponsible = await this.professionalCouncilResponsibleRepository.update({
      ...UpsertProfessionalCouncilResponsibleDto,
      companyId: user.targetCompanyId,
    });

    this.employeePPPHistoryRepository.updateManyNude({
      data: { sendEvent: true },
      where: {
        employee: {
          companyId: user.targetCompanyId,
        },
      },
    });

    return professionalCouncilResponsible;
  }
}
