import { Injectable } from '@nestjs/common';

import { ExamRiskRulePublishFromSelectionService } from '@/@v2/medicine/esocial-t27-exam/exam-risk-rule-publish-from-selection.service';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateExamsRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';

@Injectable()
export class CreateExamRiskService {
  constructor(
    private readonly examRiskRepository: ExamRiskRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
    private readonly publishSystemRuleService: ExamRiskRulePublishFromSelectionService,
  ) {}

  async execute(createExamDto: CreateExamsRiskDto, user: UserPayloadDto) {
    const { publishAsSystemRule, ...examRiskData } = createExamDto;

    const ExamFactor = await this.examRiskRepository.create({
      ...examRiskData,
      companyId: user.targetCompanyId,
    });

    this.checkEmployeeExamService.execute({
      companyId: user.targetCompanyId,
      riskId: ExamFactor.riskId,
    });

    let systemRule:
      | Awaited<ReturnType<ExamRiskRulePublishFromSelectionService['publish']>>
      | undefined;

    if (publishAsSystemRule) {
      systemRule = await this.publishSystemRuleService.publish(
        {
          riskFactorId: examRiskData.riskId,
          examId: examRiskData.examId,
          companyId: user.targetCompanyId,
          validityInMonths: examRiskData.validityInMonths,
          considerBetweenDays: examRiskData.considerBetweenDays,
          fromAge: examRiskData.fromAge,
          toAge: examRiskData.toAge,
          minRiskDegree: examRiskData.minRiskDegree,
          minRiskDegreeQuantity: examRiskData.minRiskDegreeQuantity,
          isAdmission: examRiskData.isAdmission,
          isPeriodic: examRiskData.isPeriodic,
          isChange: examRiskData.isChange,
          isReturn: examRiskData.isReturn,
          isDismissal: examRiskData.isDismissal,
          isMale: examRiskData.isMale,
          isFemale: examRiskData.isFemale,
        },
        user,
      );
    }

    return {
      ...ExamFactor,
      companyLinkCreatedOrUpdated: true,
      ...(systemRule ? { systemRule } : {}),
    };
  }
}
