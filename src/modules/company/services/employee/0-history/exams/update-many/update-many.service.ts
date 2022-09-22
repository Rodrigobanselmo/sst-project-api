import { MessageEnum } from './../../../../../../../shared/constants/enum/message.enum';
import { MessageNotificationDto } from './../../../../../../notifications/dto/nofication.dto';
import { NotificationRepository } from './../../../../../../notifications/repositories/implementations/NotificationRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ExamHistoryEvaluationEnum, StatusEnum } from '@prisma/client';

import { DayJSProvider } from '../../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { UpdateManyScheduleExamDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { CreateEmployeeHierarchyHistoryService } from '../../hierarchy/create/create.service';
import { ErrorMessageEnum } from './../../../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from './../../../../../../../shared/dto/user-payload.dto';
import { EmployeeEntity } from './../../../../../entities/employee.entity';

@Injectable()
export class UpdateManyScheduleExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService,
    private readonly dayJSProvider: DayJSProvider,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    { data, isClinic, ...dataDto }: UpdateManyScheduleExamDto,
    user: UserPayloadDto,
  ) {
    const employeeId = data.every(
      (dt) => data?.[0]?.employeeId === dt?.employeeId,
    )
      ? data[0]?.employeeId
      : 0;

    let found: EmployeeEntity;
    if (!isClinic)
      found = await this.employeeRepository.findFirstNude({
        select: { id: true, companyId: true },
        where: {
          companyId: user.targetCompanyId,
          id: employeeId,
        },
      });

    if (isClinic)
      found = await this.employeeRepository.findFirstNude({
        select: { id: true, companyId: true },
        where: {
          OR: [
            { examsHistory: { some: { clinicId: user.targetCompanyId } } },
            { companyId: user.targetCompanyId },
          ],
          id: employeeId,
        },
      });

    //tenant
    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    await this.employeeRepository.update({
      companyId: found.companyId,
      id: employeeId,
      ...dataDto,
    });

    const history = await this.employeeExamHistoryRepository.updateMany({
      data,
    });

    try {
      await this.changeHierarchy({ data, isClinic, ...dataDto }, user, found);
    } catch (err) {
      //! do something with error
      console.log(err);
    }

    try {
      await this.sendNotification({ data, isClinic, ...dataDto }, user, found);
    } catch (err) {
      console.log(err);
    }

    return history;
  }

  async changeHierarchy(
    dataDto: UpdateManyScheduleExamDto,
    user: UserPayloadDto,
    employee: EmployeeEntity,
  ) {
    const clinicExam = dataDto.data.find(
      (e) => e.evaluationType === ExamHistoryEvaluationEnum.APTO,
    );

    if (!clinicExam?.id) return;

    const clinicHistory =
      await this.employeeExamHistoryRepository.findUniqueNude({
        where: { id: clinicExam.id },
      });

    if (clinicExam?.changeHierarchyAnyway) return;

    if (clinicHistory.hierarchyId)
      await this.createEmployeeHierarchyHistoryService.execute(
        {
          employeeId: employee.id,
          hierarchyId: clinicHistory.hierarchyId,
          motive: clinicHistory.examType === 'ADMI' ? 'ADM' : 'TRANS_PROM',
          startDate:
            clinicHistory?.changeHierarchyDate || this.dayJSProvider.dateNow(),
        },
        user,
      );

    if (clinicHistory.examType === 'DEMI' && !clinicHistory.hierarchyId)
      await this.createEmployeeHierarchyHistoryService.execute(
        {
          employeeId: employee.id,
          hierarchyId: null,
          motive: 'DEM',
          startDate:
            clinicHistory?.changeHierarchyDate || this.dayJSProvider.dateNow(),
        },
        user,
      );
  }

  async sendNotification(
    dataDto: UpdateManyScheduleExamDto,
    user: UserPayloadDto,
    employee: EmployeeEntity,
  ) {
    dataDto;
    if (dataDto?.isClinic) return;

    const examData = dataDto.data.find(
      (e) => e.status === StatusEnum.PROCESSING,
    );

    if (!examData?.id) return;

    const message: MessageNotificationDto = {
      message:
        'Seus exames tiveram o status alterado para "agendado", verifique sua agenda para mais informações',
      title: 'Pedido de agenda atualizado',
      type: MessageEnum.SUCCESS,
    };

    this.notificationRepository.create({
      companyId: user.companyId,
      json: message,
      isCompany: true,
      companiesIds: [user.targetCompanyId],
      repeatId: 'schedule_status_pending',
    });
  }
}
