import { ExamRepository } from './../../../repositories/implementations/ExamRepository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExamToClinicRepository } from '../../../repositories/implementations/ExamToClinicRepository';

@Injectable()
export class DeleteExamToClinicService {
  constructor(
    private readonly examToClinicRepository: ExamToClinicRepository,
    private readonly examRepository: ExamRepository,
  ) {}

  async execute(id: number, user: UserPayloadDto) {
    const examToClinic = await this.examToClinicRepository.findFirstNude({
      where: {
        companyId: user.targetCompanyId,
        id,
      },
    });

    if (!examToClinic?.companyId) {
      throw new BadRequestException('Exame não encontrado ou sem permissão para editar');
    }

    const exam = await this.examRepository.findFirstNude({
      where: {
        id: examToClinic.examId,
        employeesHistory: {
          some: {
            clinicId: examToClinic.companyId,
            AND: [
              ...(examToClinic.startDate
                ? [
                    {
                      doneDate: { gte: examToClinic.startDate },
                    },
                  ]
                : []),
              ...(examToClinic.endDate
                ? [
                    {
                      doneDate: { lte: examToClinic.endDate },
                    },
                  ]
                : []),
            ],
          },
        },
      },
    });

    if (exam?.id)
      throw new BadRequestException('Você não pode excluir um exame que já foi realizado por um funcionário');

    const deletedExamClinic = await this.examToClinicRepository.delete(id);

    const foundEqual = await this.examToClinicRepository.findNude({
      where: {
        examId: examToClinic.examId,
        companyId: examToClinic.companyId,
        isAdmission: examToClinic.isAdmission,
        isReturn: examToClinic.isReturn,
        isChange: examToClinic.isChange,
        isDismissal: examToClinic.isDismissal,
        isPeriodic: examToClinic.isPeriodic,
      },
      take: 1,
      select: { id: true, companyId: true, examId: true, startDate: true },
    });

    if (foundEqual.length > 0) {
      const lastData = foundEqual[0];
      await this.examToClinicRepository.update({
        companyId: lastData.companyId,
        id: lastData.id,
        examId: examToClinic.examId,
        endDate: null,
        startDate: lastData.startDate,
      });
    }

    return deletedExamClinic;
  }
}
