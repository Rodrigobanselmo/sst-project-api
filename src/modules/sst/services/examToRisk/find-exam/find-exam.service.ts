import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindExamRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';

@Injectable()
export class FindExamRiskService {
  constructor(
    private readonly examRiskRepository: ExamRiskRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute({ skip, take, ...query }: FindExamRiskDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const consultantCompanies = await this.companyRepository.findConsultant(companyId, {
      select: { id: true },
    });

    const consultantCompaniesIds = consultantCompanies.map(({ id }) => id);
    const companyIds = [companyId, ...consultantCompaniesIds];

    const Exam = await this.examRiskRepository.find(
      { ...query, companyId: companyIds, targetCompanyId: companyId },
      { skip, take },
      {
        include: {
          exam: { select: { name: true, id: true, isAttendance: true } },
          risk: { select: { name: true, id: true, type: true, esocialCode: true } },
        },
      },
    );

    return Exam;
  }
}
