import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { IExamOriginData } from '../../../../sst/entities/exam.entity';
import { FindExamByHierarchyService } from '../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { FindCompanyDashDto } from '../../../dto/dashboard.dto';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';
import { Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateContactDto } from '../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';

@Injectable()
export class DashboardCompanyService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly documentRepository: DocumentRepository,
    private readonly dayjs: DayJSProvider,
  ) {}

  async execute(UpsertContactsDto: FindCompanyDashDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const total = await this.employeeRepository.findNude({
      where: { companyId },
    });

    const missingExam = await this.employeeRepository.findNude({
      where: { companyId, examsHistory: { none: { id: { gte: 0 } } } },
      select: {
        id: true,
        name: true,
        lastExam: true,
        hierarchyId: true,
        subOffices: { select: { id: true } },
      },
    });

    const withExam = await this.employeeRepository.findNude({
      where: { companyId, examsHistory: { some: { id: { gt: 0 } } } },
      include: { examsHistory: { where: { exam: { isAttendance: true } } } },
    });

    const withExamAndExpired = await this.employeeRepository.findNude({
      where: {
        companyId,
        examsHistory: {
          some: { id: { gt: 0 } },
          none: {
            expiredDate: { gt: this.dayjs.dateNow() },
            exam: { isAttendance: true },
          },
        },
      },
    });

    const withExamAndSchedule = await this.employeeRepository.findNude({
      where: {
        companyId,
        examsHistory: {
          some: {
            id: { gt: 0 },
            doneDate: { gte: this.dayjs.dateNow() },
            status: { in: ['PENDING', 'PROCESSING'] },
            exam: { isAttendance: true },
          },
        },
      },
    });

    const exams = await this.findExamByHierarchyService.execute(user, {
      onlyAttendance: true,
    });

    const getExpired = missingExam.map((employee) => {
      const ids = [
        ...employee.subOffices.map(({ id }) => id),
        employee.hierarchyId,
      ];

      let expiredDate: Date;
      exams.data.find(({ exam, origins }) => {
        if (!exam.isAttendance) return false;

        origins.find((origin) => {
          const isPartOfHomo = origin?.homogeneousGroup
            ? origin.homogeneousGroup?.hierarchyOnHomogeneous?.find(
                (homoHier) => ids.includes(homoHier?.hierarchy?.id),
              )
            : true;
          if (!isPartOfHomo) return;

          const skip = this.findExamByHierarchyService.checkIfSkipEmployee(
            origin,
            employee,
          );
          if (skip) return;

          const expired = this.findExamByHierarchyService.checkExpiredDate(
            origin,
            employee,
          );
          if (!expired.expiredDate) return;
          expiredDate = expired.expiredDate;
          return true;
        });
      });

      const expired = expiredDate ? { expiredDate } : {};

      return { ...employee, ...expired };
    });

    const missingExamExpired = getExpired.filter((e) => {
      if (!e.expiredDate) return true;

      const lastExamValid = this.dayjs
        .dayjs(e.expiredDate)
        .isAfter(this.dayjs.dayjs());

      if (!lastExamValid) return true;
      return false;
    });

    //

    return {
      exams: {
        exams: exams.data,
        total,
        withExam,
        withExamAndSchedule,
        missingExam,
        expired: { missingExamExpired, withExamAndExpired },
      },
    };
  }
}
