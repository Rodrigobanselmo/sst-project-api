import { NotificationRepository } from './../../../../../../notifications/repositories/implementations/NotificationRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';
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
  ) {}

  async execute(dataDto: CreateEmployeeExamHistoryDto, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(
      dataDto.employeeId,
      user.targetCompanyId,
    );

    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    await this.checkOtherSchedulesAndCancel(dataDto, found);
    await this.changeHierarchy(dataDto, user);

    const history = await this.employeeExamHistoryRepository.create({
      ...dataDto,
      ...this.getUser(dataDto, user),
    });

    return history;
  }

  getUser(dataDto: CreateEmployeeExamHistoryDto, user: UserPayloadDto) {
    const status =
      dataDto.status || dataDto.examsData?.find((e) => e.status)?.status;
    const isUserScheduleId =
      status &&
      ([StatusEnum.PENDING, StatusEnum.PROCESSING] as any).includes(status);

    const isUserDoneId =
      !status ||
      (status &&
        ([StatusEnum.DONE, StatusEnum.CANCELED] as any).includes(status));

    return {
      ...(isUserDoneId && {
        userDoneId: user.userId,
      }),
      ...(isUserScheduleId && {
        userScheduleId: user.userId,
      }),
    };
  }

  async checkOtherSchedulesAndCancel(
    dataDto: CreateEmployeeExamHistoryDto,
    employee: EmployeeEntity,
  ) {
    const examsIds = dataDto.examsData.map((x) => x.examId);

    if (dataDto.examId) examsIds.push(dataDto.examId);

    const oldSchedules = await this.employeeExamHistoryRepository.findNude({
      where: {
        status: { in: ['PROCESSING', 'PENDING'] },
        employeeId: employee.id,
        examId: { in: examsIds },
      },
    });

    const cancelIds = oldSchedules.map((e) => e.id);

    await this.employeeExamHistoryRepository.updateByIds({
      data: { status: StatusEnum.CANCELED },
      where: { id: { in: cancelIds } },
    });
  }

  async changeHierarchy(
    dataDto: CreateEmployeeExamHistoryDto,
    user: UserPayloadDto,
  ) {
    if (
      dataDto.changeHierarchyAnyway &&
      dataDto.changeHierarchyDate &&
      dataDto.hierarchyId
    )
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

    if (
      dataDto.examType === 'DEMI' &&
      dataDto.changeHierarchyDate &&
      !dataDto.hierarchyId
    )
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
