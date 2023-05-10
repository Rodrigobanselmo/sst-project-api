import { CheckEmployeeExamService } from './../../../../../../sst/services/exam/check-employee-exam/check-employee-exam.service';
import { NotificationRepository } from './../../../../../../notifications/repositories/implementations/NotificationRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ExamHistoryTypeEnum, StatusEnum } from '@prisma/client';
import { EmployeeEntity } from '../../../../../../../modules/company/entities/employee.entity';
import { ErrorMessageEnum } from '../../../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { CreateEmployeeHierarchyHistoryService } from '../../hierarchy/create/create.service';
import { CreateEmployeeExamHistoryDto } from './../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class CreateEmployeeExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService,
    private readonly notificationRepository: NotificationRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(dataDto: CreateEmployeeExamHistoryDto, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(dataDto.employeeId, user.targetCompanyId);

    if (!found?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    await this.checkOtherSchedulesAndCancel(dataDto, found, user);
    await this.changeHierarchy(dataDto, found, user);

    const history = await this.employeeExamHistoryRepository.create({
      ...dataDto,
      ...this.getUser(dataDto, user),
    });

    if (([StatusEnum.DONE, StatusEnum.CANCELED] as StatusEnum[]).includes(dataDto.status)) {
      this.checkEmployeeExamService.execute({
        employeeId: dataDto.employeeId,
      });
    }

    return history;
  }

  getUser(dataDto: CreateEmployeeExamHistoryDto, user: UserPayloadDto) {
    const status = dataDto.status || dataDto.examsData?.find((e) => e.status)?.status;
    const isUserScheduleId = status && ([StatusEnum.PENDING, StatusEnum.PROCESSING] as any).includes(status);

    const isUserDoneId = !status || (status && ([StatusEnum.DONE, StatusEnum.CANCELED] as any).includes(status));

    return {
      ...(isUserDoneId && {
        userDoneId: user.userId,
      }),
      ...(isUserScheduleId && {
        userScheduleId: user.userId,
      }),
    };
  }

  async checkOtherSchedulesAndCancel(dataDto: CreateEmployeeExamHistoryDto, employee: EmployeeEntity, user: UserPayloadDto) {
    const examsIds = dataDto?.examsData?.map((x) => x.examId) || [];

    if (dataDto.examId) examsIds.push(dataDto.examId);

    const oldSchedules = await this.employeeExamHistoryRepository.findNude({
      select: { id: true, examType: true },
      orderBy: { created_at: 'desc' },
      where: {
        status: { in: ['PROCESSING', 'PENDING'] },
        employeeId: employee.id,
        examId: { in: examsIds },
      },
    });

    const skipCancel = [];

    const cancelIds = oldSchedules
      .filter((oldExam) => {
        const isAdm = dataDto.examType == 'ADMI';
        const isDem = dataDto.examType == 'DEMI';
        const isRet = dataDto.examType == 'RETU';
        const isEva = dataDto.examType == 'EVAL';

        const isAdmOld = oldExam.examType == 'ADMI';
        const isDemOld = oldExam.examType == 'DEMI';
        const isRetOld = oldExam.examType == 'RETU';
        const isEvaOld = oldExam.examType == 'EVAL';

        if (isAdm && isDemOld && !skipCancel.includes(ExamHistoryTypeEnum.DEMI)) {
          skipCancel.push(ExamHistoryTypeEnum.DEMI);
          return false;
        }

        if (isDem && isAdmOld && !skipCancel.includes(ExamHistoryTypeEnum.ADMI)) {
          skipCancel.push(ExamHistoryTypeEnum.ADMI);
          return false;
        }

        if ((isRet || isEva) && !skipCancel.includes(oldExam.examType)) {
          skipCancel.push(oldExam.examType);
          return false;
        }

        if ((isRetOld || isEvaOld) && !skipCancel.includes(oldExam.examType)) {
          skipCancel.push(oldExam.examType);
          return false;
        }

        return true;
      })
      .map((e) => e.id);

    await this.employeeExamHistoryRepository.updateByIds({
      data: { status: StatusEnum.CANCELED, userDoneId: user.userId },
      where: { id: { in: cancelIds } },
    });
  }

  async changeHierarchy(dataDto: CreateEmployeeExamHistoryDto, employee: EmployeeEntity, user: UserPayloadDto) {
    if (dataDto.changeHierarchyAnyway && dataDto.changeHierarchyDate && dataDto.hierarchyId) {
      if (employee.hierarchyId !== dataDto.hierarchyId)
        await this.createEmployeeHierarchyHistoryService.execute(
          {
            employeeId: dataDto.employeeId,
            hierarchyId: dataDto.hierarchyId,
            motive: dataDto.examType === 'ADMI' ? 'ADM' : 'TRANS_PROM',
            startDate: dataDto.changeHierarchyDate,
            subOfficeId: dataDto.subOfficeId,
          },
          user,
        );
    }

    if (dataDto.examType === 'DEMI' && dataDto.changeHierarchyDate && !dataDto.hierarchyId)
      if (employee.hierarchyId)
        await this.createEmployeeHierarchyHistoryService.execute(
          {
            employeeId: dataDto.employeeId,
            hierarchyId: null,
            motive: 'DEM',
            startDate: dataDto.changeHierarchyDate,
          },
          user,
        );
  }
}
