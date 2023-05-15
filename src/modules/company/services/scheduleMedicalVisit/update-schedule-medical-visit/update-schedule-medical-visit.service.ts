import { CheckEmployeeExamService } from './../../../../sst/services/exam/check-employee-exam/check-employee-exam.service';
import { EmployeeExamsHistoryRepository } from './../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { ScheduleMedicalVisitRepository } from './../../../repositories/implementations/ScheduleMedicalVisitRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { UpdateScheduleMedicalVisitDto } from '../../../../..//modules/company/dto/scheduleMedicalVisit.dto';
import { CreateEmployeeExamHistoryService } from '../../employee/0-history/exams/create/create.service';
import { UpdateEmployeeExamHistoryService } from '../../employee/0-history/exams/update/update.service';
import { asyncBatch } from 'src/shared/utils/asyncBatch';
import { StatusEnum } from '@prisma/client';

@Injectable()
export class UpdateScheduleMedicalVisitsService {
  constructor(
    private readonly createEmployeeExamHistoryService: CreateEmployeeExamHistoryService,
    private readonly updateEmployeeExamHistoryService: UpdateEmployeeExamHistoryService,
    private readonly scheduleMedicalVisitRepository: ScheduleMedicalVisitRepository,
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) { }

  async execute(body: UpdateScheduleMedicalVisitDto, user: UserPayloadDto) {
    const handleExamHistoryCreation = async (exam: typeof body.exams[0]) => {
      if (exam.id) return await this.updateEmployeeExamHistoryService.execute({ id: exam.id, ...exam }, user);

      return await this.createEmployeeExamHistoryService.execute({ ...exam, scheduleMedicalVisitId: body.id }, user);
    };

    await asyncBatch(body.exams, 20, handleExamHistoryCreation);

    const visit = await this.scheduleMedicalVisitRepository.update({
      ...body,
      companyId: user.targetCompanyId,
    });

    if (([StatusEnum.DONE, StatusEnum.CANCELED] as StatusEnum[]).includes(body.status))
      await this.checkEmployeeExamService.execute({
        companyId: user.targetCompanyId,
      });

    return visit;
  }
}
