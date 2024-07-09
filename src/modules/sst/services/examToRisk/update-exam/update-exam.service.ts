import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateExamRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';
import { CreateExamRiskService } from '../create-exam/create-exam.service';
import { asyncEach } from '../../../../../shared/utils/asyncEach';

@Injectable()
export class UpdateExamRiskService {
  constructor(
    private readonly createExamRiskService: CreateExamRiskService,
    private readonly examRiskRepository: ExamRiskRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(id: number, { realCompanyId, ...updateExamDto }: UpdateExamRiskDto, user: UserPayloadDto) {
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

    return exam;
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
