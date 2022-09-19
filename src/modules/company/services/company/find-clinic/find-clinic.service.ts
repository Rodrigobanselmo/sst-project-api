import { Injectable } from '@nestjs/common';

import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class FindClinicService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(clinicId: string, user: UserPayloadDto) {
    const company = await this.companyRepository.findFirstNude({
      where: { id: clinicId },
      select: {
        id: true,
        address: true,
        email: true,
        phone: true,
        contacts: true,
        fantasy: true,
        name: true,
        initials: true,
        clinicExams: {
          where: {
            startDate: { lte: new Date() },
            OR: [{ endDate: { gte: new Date() } }, { endDate: null }],
            status: 'ACTIVE',
          },
          select: {
            dueInDays: true,
            scheduleType: true,
            scheduleRange: true,
            examId: true,
            endDate: true,
            id: true,
            isPeriodic: true,
            isChange: true,
            isAdmission: true,
            isReturn: true,
            isDismissal: true,
            observation: true,
            isScheduled: true,
          },
        },
        //! this is loading all exams, could just load the exams required on schedule
        // clinicExams: { where: { examId: { in: [] } } },
      },
    });

    return company;
  }
}
