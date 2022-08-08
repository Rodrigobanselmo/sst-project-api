import { ExamToClinicRepository } from './../../../repositories/implementations/ExamToClinicRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

import { UpsertExamToClinicDto } from 'src/modules/checklist/dto/exam-to-clinic.dto';

@Injectable()
export class UpsertExamToClinicService {
  constructor(
    private readonly examToClinicRepository: ExamToClinicRepository,
  ) {}

  async execute(createExamDto: UpsertExamToClinicDto, user: UserPayloadDto) {
    const ExamFactor = await this.examToClinicRepository.upsert({
      ...createExamDto,
      companyId: user.targetCompanyId,
    });

    return ExamFactor;
  }
}
