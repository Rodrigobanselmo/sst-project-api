import { BadRequestException, Injectable } from '@nestjs/common';

import { ExamRiskRulePublishFromSelectionService } from '@/@v2/medicine/esocial-t27-exam/exam-risk-rule-publish-from-selection.service';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { asyncEach } from '../../../../../shared/utils/asyncEach';
import { UpdateExamRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';
import { CreateExamRiskService } from '../create-exam/create-exam.service';

@Injectable()
export class UpdateExamRiskService {
  constructor(
    private readonly createExamRiskService: CreateExamRiskService,
    private readonly examRiskRepository: ExamRiskRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
    private readonly publishSystemRuleService: ExamRiskRulePublishFromSelectionService,
  ) {}

  async execute(
    id: number,
    { realCompanyId, publishAsSystemRule, ...updateExamDto }: UpdateExamRiskDto,
    user: UserPayloadDto,
  ) {
    const found = await this.examRiskRepository.findFirstNude({
      where: { id, companyId: user.targetCompanyId, deletedAt: null },
      select: {
        id: true,
        riskId: true,
        company: {
          select: {
            applyingServiceContracts: {
              where: { status: 'ACTIVE', receivingServiceCompany: { status: 'ACTIVE' } },
              select: {
                receivingServiceCompanyId: true,
              },
            },
          },
        },
      },
    });

    if (!found?.id) throw new BadRequestException('Não encontrado');

    if (realCompanyId != user.targetCompanyId) {
      await this.examRiskRepository.update({
        id,
        companyId: user.targetCompanyId,
        addSkipCompanyId: realCompanyId,
      });

      const examRisk = await this.createExamRiskService.execute(
        {
          companyId: realCompanyId,
          considerBetweenDays: updateExamDto.considerBetweenDays,
          examId: updateExamDto.examId,
          fromAge: updateExamDto.fromAge,
          riskId: updateExamDto.riskId,
          isAdmission: updateExamDto.isAdmission,
          isChange: updateExamDto.isChange,
          isReturn: updateExamDto.isReturn,
          isPeriodic: updateExamDto.isPeriodic,
          isDismissal: updateExamDto.isDismissal,
          isFemale: updateExamDto.isFemale,
          lowValidityInMonths: updateExamDto.lowValidityInMonths,
          minRiskDegree: updateExamDto.minRiskDegree,
          minRiskDegreeQuantity: updateExamDto.minRiskDegreeQuantity,
          startDate: updateExamDto.startDate,
          toAge: updateExamDto.toAge,
          validityInMonths: updateExamDto.validityInMonths,
          isMale: updateExamDto.isMale,
          publishAsSystemRule,
        },
        { ...user, targetCompanyId: realCompanyId },
      );

      this.checkEmployeeExam({
        companyIds: [realCompanyId],
        foundRiskId: found.riskId,
        riskId: updateExamDto.riskId,
      });

      return examRisk;
    }

    const exam = await this.examRiskRepository.update({
      id,
      companyId: user.targetCompanyId,
      ...updateExamDto,
    });

    this.checkEmployeeExam({
      companyIds: [
        user.targetCompanyId,
        ...(found?.company?.applyingServiceContracts?.map(
          ({ receivingServiceCompanyId }) => receivingServiceCompanyId,
        ) || []),
      ],
      foundRiskId: found.riskId,
      riskId: updateExamDto.riskId,
    });

    let systemRule:
      | Awaited<ReturnType<ExamRiskRulePublishFromSelectionService['publish']>>
      | undefined;

    if (publishAsSystemRule && updateExamDto.riskId && updateExamDto.examId) {
      systemRule = await this.publishSystemRuleService.publish(
        {
          riskFactorId: updateExamDto.riskId,
          examId: updateExamDto.examId,
          companyId: user.targetCompanyId,
          validityInMonths: updateExamDto.validityInMonths,
          considerBetweenDays: updateExamDto.considerBetweenDays,
          fromAge: updateExamDto.fromAge,
          toAge: updateExamDto.toAge,
          minRiskDegree: updateExamDto.minRiskDegree,
          minRiskDegreeQuantity: updateExamDto.minRiskDegreeQuantity,
          isAdmission: updateExamDto.isAdmission,
          isPeriodic: updateExamDto.isPeriodic,
          isChange: updateExamDto.isChange,
          isReturn: updateExamDto.isReturn,
          isDismissal: updateExamDto.isDismissal,
          isMale: updateExamDto.isMale,
          isFemale: updateExamDto.isFemale,
        },
        user,
      );
    }

    return {
      ...exam,
      ...(systemRule ? { systemRule } : {}),
    };
  }

  private async checkEmployeeExam({
    companyIds,
    riskId,
    foundRiskId,
  }: {
    companyIds: string[];
    riskId: string;
    foundRiskId: string;
  }) {
    await asyncEach(companyIds, async (companyId) => {
      await this.checkEmployeeExamService.execute({
        companyId,
        riskId,
      });

      if (riskId != foundRiskId)
        await this.checkEmployeeExamService.execute({
          companyId,
          riskId: foundRiskId,
        });
    });
  }
}
