import { EmployeeExamsHistoryRepository } from './../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ScheduleMedicalVisitRepository } from '../../../repositories/implementations/ScheduleMedicalVisitRepository';
import { CreateScheduleMedicalVisitDto } from '../../../../../modules/company/dto/scheduleMedicalVisit.dto';
import { CreateEmployeeExamHistoryService } from '../../employee/0-history/exams/create/create.service';
import { asyncBatch } from '../../../../../shared/utils/asyncBatch';

@Injectable()
export class CreateScheduleMedicalVisitsService {
  constructor(
    private readonly createEmployeeExamHistoryService: CreateEmployeeExamHistoryService,
    private readonly scheduleMedicalVisitRepository: ScheduleMedicalVisitRepository,
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
  ) {}

  async execute(body: CreateScheduleMedicalVisitDto, user: UserPayloadDto) {
    // const handleExamHistoryCreation = async (exam: typeof body.exams[0]) => {
    //   return await this.employeeExamHistoryRepository.create({
    //     ...exam,
    //     ...this.createEmployeeExamHistoryService.getUser(exam, user),
    //   });
    // };

    // const x = await asyncBatch(body.exams, 20, handleExamHistoryCreation);

    const medicalVisit = await this.scheduleMedicalVisitRepository.create({
      ...body,
      companyId: user.targetCompanyId,
      userId: user.userId,
    });

    return medicalVisit;
  }
}
