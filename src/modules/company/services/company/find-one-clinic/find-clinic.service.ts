import { ScheduleBlockRepository } from '../../../repositories/implementations/ScheduleBlockRepository';
import { Injectable } from '@nestjs/common';

import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class FindClinicService {
  constructor(
    private readonly scheduleBlocksRepository: ScheduleBlockRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly dayjsProvider: DayJSProvider,
  ) {}

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
        scheduleBlocks: {
          select: { startDate: true, endDate: true, endTime: true, startTime: true, yearRecurrence: true },
          where: {
            status: 'ACTIVE',
            OR: [
              {
                yearRecurrence: false,
                endDate: { gte: this.dayjsProvider.format(new Date(), 'YYYY-MM-DD') },
              },
              {
                yearRecurrence: true,
                endDate: { gte: this.dayjsProvider.format(new Date(), 'MM-DD') },
              },
            ],
          },
        },
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
            examMinDuration: true,
          },
        },
        //! this is loading all exams, could just load the exams required on schedule
        // clinicExams: { where: { examId: { in: [] } } },
      },
    });

    const schedules = await this.scheduleBlocksRepository.findNude({
      where: {
        allCompanies: true,
        status: 'ACTIVE',
        OR: [
          {
            yearRecurrence: false,
            endDate: { gte: this.dayjsProvider.format(new Date(), 'YYYY-MM-DD') },
          },
          {
            yearRecurrence: true,
            endDate: { gte: this.dayjsProvider.format(new Date(), 'MM-DD') },
          },
        ],
      },
    });
    company.scheduleBlocks.push(...schedules);

    return company;
  }
}
