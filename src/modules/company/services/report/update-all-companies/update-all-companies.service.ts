import { PermissionCompanyEnum } from './../../../../../shared/constants/enum/permissionsCompany';
import { EmployeeExamsHistoryEntity } from './../../../entities/employee-exam-history.entity';
import { UpsertCompanyReportDto } from './../../../dto/company-report.dto';
import { EmployeeEntity } from '../../../../../modules/company/entities/employee.entity';
import { CompanyEntity } from './../../../entities/company.entity';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { asyncEach } from '../../../../../shared/utils/asyncEach';
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
import { TelegramService } from 'nestjs-telegram';
import { CompanyReportRepository } from '../../../../../modules/company/repositories/implementations/CompanyReportRepository';
import { arrayChunks } from '../../../../../shared/utils/arrayChunks';
import { asyncBatch } from '../../../../../shared/utils/asyncBatch';
import { ESocialEventProvider } from '../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { UpdateESocialReportService } from '../update-esocial-report/update-esocial-report.service';

export const standardDate = '1900-01-01';
@Injectable()
export class UpdateAllCompaniesService {
  private chatId = 1301254235;
  private standardDate = standardDate;
  private errorCompanies = [];
  private error: Error;

  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly companyRepository: CompanyRepository,
    private readonly dayjs: DayJSProvider,
    private readonly telegram: TelegramService,
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly companyReportRepository: CompanyReportRepository,
    private readonly updateESocialReportService: UpdateESocialReportService,
  ) { }

  async execute(user?: UserPayloadDto) {
    const companyId = user?.targetCompanyId;

    console.info('start cron(1): All companies');
    const allCompanies = await this.companyRepository.findNude({
      select: {
        id: true,
        esocialStart: true,
        permissions: true,
        cnpj: true,
        doctorResponsible: {
          include: { professional: { select: { name: true } } },
        },
        group: {
          select: {
            doctorResponsible: {
              include: { professional: { select: { name: true } } },
            },
            esocialStart: true,
            companyGroup: { select: { cert: true } },
          },
        },
        applyingServiceContracts: {
          where: { status: 'ACTIVE', },
          select: { receivingServiceCompanyId: true },
        },
      },
      where: {
        status: 'ACTIVE',
        isClinic: false,
        // ...(!companyId && { //? does not get companies that had updated report recently
        //   OR: [
        //     {
        //       report: {
        //         lastDailyReport: {
        //           lte: this.dayjs.addTime(new Date(), -3, 'hours'),
        //         },
        //       },
        //     },
        //     { report: null },
        //   ],
        // }),
        ...(companyId && {
          OR: [
            { id: companyId },
            {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: companyId },
              },
            },
          ],
        }),
      },
    });

    const employeeExams = (await asyncEach(allCompanies, (v) => this.addReport(v))).map(
      ({ company, examTime, esocialEvents }): UpsertCompanyReportDto & { company: CompanyEntity } => {

        return {
          company: company,
          companyId: company.id,
          lastDailyReport: this.dayjs.dateNow(),
          dailyReport: {
            exam: examTime,
            esocial: esocialEvents
          },
        };
      },
    );

    const employeeExamsData = employeeExams.map(({ company, ...report }): UpsertCompanyReportDto => {
      const companyIds = company?.applyingServiceContracts?.map((c) => c.receivingServiceCompanyId) || [];

      if (companyIds.length === 0) return report;

      employeeExams.forEach((employeeExam) => {
        if (companyIds.includes(employeeExam.companyId)) {
          Object.entries(employeeExam.dailyReport.exam).map(([k, v]) => {
            if (typeof v === 'number') {
              if (!report.dailyReport.exam[k]) report.dailyReport.exam[k] = 0;
              report.dailyReport.exam[k] = report.dailyReport.exam[k] + v;
            }
          });
          Object.entries(employeeExam.dailyReport.esocial).map(([k, v]) => {
            if (typeof v === 'number') {
              if (!report.dailyReport.esocial[k]) report.dailyReport.esocial[k] = 0;
              report.dailyReport.esocial[k] = report.dailyReport.esocial[k] + v;
            }

            if (typeof v === 'object') {
              Object.entries(v).map(([_k, _v]) => {
                if (!report.dailyReport.esocial[k]) report.dailyReport.esocial[k] = {};
                if (!report.dailyReport.esocial[k][_k]) report.dailyReport.esocial[k][_k] = 0;

                if (typeof _v === 'number') {
                  report.dailyReport.esocial[k][_k] = report.dailyReport.esocial[k][_k] + _v;
                }
              });
            }
          });
        }
      });

      return report;
    });
    console.info('start cron(3): telegram');
    this.telegramMessage(allCompanies);

    console.info('start cron(4): reports');
    await asyncBatch(employeeExamsData, 50, async (report) => {
      await this.companyReportRepository.updateESocialReport(report.companyId, report.dailyReport);
    });
    console.info('end cron(4): reports');

    this.errorCompanies = [];
    this.error = undefined;
    return employeeExamsData;
  }

  async addReport(company: CompanyEntity) {
    const examTime = await this.addEmployeeExamTime(company);
    const esocialEvents = await this.addCompanyEsocial(company);

    return { examTime, esocialEvents, company };
  }

  async addEmployeeExamTime(company: CompanyEntity, options?: { employeeIds?: number[] }) {
    const isSchedule = company.permissions.includes(PermissionCompanyEnum.schedule)

    if (!isSchedule) return {
      all: 0,
      expired: 0,
      good: 0,
      schedule: 0,
      expiredClose1: 0,
      expiredClose2: 0,
    }

    const companyId = company.id;
    const date = this.dayjs.dayjs().hour(0).minute(0).second(0).millisecond(0).toDate();
    const date45 = this.dayjs.dayjs().hour(0).minute(0).second(0).millisecond(0).add(45, 'day').toDate();
    const date90 = this.dayjs.dayjs().hour(0).minute(0).second(0).millisecond(0).add(90, 'day').toDate();

    try {
      const goodPromise = this.employeeRepository.countNude({
        where: {
          companyId,
          expiredDateExam: { gt: date90 },
        }
      });

      const expiredPromise = this.employeeRepository.countNude({
        where: {
          companyId,
          OR: [
            { expiredDateExam: { lte: date } },
            { expiredDateExam: null }
          ],
        }
      });

      const expired45Promise = this.employeeRepository.countNude({
        where: {
          companyId,
          expiredDateExam: { lte: date45, gt: date },
        }
      });

      const expired90Promise = this.employeeRepository.countNude({
        where: {
          companyId,
          expiredDateExam: { lte: date90, gt: date45 },
        }
      });

      const schedulePromise = this.employeeRepository.countNude({
        where: {
          companyId,
          examsHistory: { some: { doneDate: { gte: date }, status: 'PROCESSING' } }
        }
      });

      const [good, expired, expired45, expired90, schedule] = await Promise.all([
        goodPromise,
        expiredPromise,
        expired45Promise,
        expired90Promise,
        schedulePromise,
      ]);

      const examTime = {
        all: good + expired + expired90 + expired45,
        expired: expired,
        good: good,
        schedule: schedule,
        expiredClose1: expired45,
        expiredClose2: expired90,
      }

      return examTime;
    } catch (e) {
      this.errorCompanies.push(companyId);
      this.error = e;
    }
  }

  async addCompanyEsocial(company: CompanyEntity) {
    const companyId = company.id;
    const isEsocial = company.permissions.includes(PermissionCompanyEnum.esocial)

    const emptyEsocial = {
      ['S2240']: {
        processing: 0,
        pending: 0,
        done: 0,
        transmitted: 0,
        rejected: 0,
      },
      ['S2220']: {
        processing: 0,
        pending: 0,
        done: 0,
        transmitted: 0,
        rejected: 0,
      },
      ['S2210']: {
        processing: 0,
        pending: 0,
        done: 0,
        transmitted: 0,
        rejected: 0,
      },

    }

    if (!isEsocial) return emptyEsocial;
    if (!company.esocialStart) return emptyEsocial;

    try {
      const esocial = await this.updateESocialReportService.addCompanyEsocial(company);
      return esocial;
    } catch (e) {
      this.errorCompanies.push(companyId);
      this.error = e;
    }
  }

  async telegramMessage(allCompanies: CompanyEntity[]) {
    try {
      const messageHtml = this.errorCompanies.length
        ? `
      UPDATE ALL COMPANIES EXAMS:
      
      DONE: ${allCompanies.length - this.errorCompanies.length}
      ERRORS: ${this.errorCompanies.length}
      TOTAL: ${allCompanies.length}
      `
        : 'ALL GOOD';

      if (process.env.APP_HOST.includes('localhost')) {
        console.info(messageHtml);
        return;
      }

      await this.telegram
        .sendMessage({
          chat_id: this.chatId,
          text: messageHtml,
          parse_mode: 'html',
        })
        .toPromise();
    } catch (e) {
      console.error('TELEGRAM', e);
    }
  }

  async reloadEmployeeExamTime(companyId: string, options?: { employeeIds?: number[] }) {
    const date = this.dayjs.dayjs(this.standardDate).toDate();

    const allEmployees = (
      await this.employeeRepository.findNude({
        where: {
          companyId,
          status: { not: 'CANCELED' },
          skippedDismissalExam: { not: true },
          ...(options.employeeIds && { id: { in: options.employeeIds } }),
        },
        select: {
          id: true,
          lastExam: true,
          expiredDateExam: true,
          hierarchyId: true,
          newExamAdded: true,
          subOffices: { select: { id: true } },
          hierarchyHistory: {
            take: 1,
            select: { startDate: true },
            orderBy: { startDate: 'desc' },
            where: {
              motive: 'DEM',
            },
          },
          examsHistory: {
            select: {
              doneDate: true,
              expiredDate: true,
              status: true,
              evaluationType: true,
              validityInMonths: true,
            },
            where: {
              exam: { isAttendance: true },
              status: { in: ['DONE', 'PROCESSING', 'PENDING'] },
            },
            orderBy: { doneDate: 'desc' },
          },
        },
      })
    ).map((e) => ({ ...e, expiredDateExamOld: e.expiredDateExam }));

    const allWithMissingExam = [] as EmployeeEntity[];

    allEmployees.forEach((employee) => {
      const hasExam = employee?.examsHistory?.length > 0;
      const missingExam = employee?.examsHistory?.length == 0;

      if (!employee.hierarchyId) {
        const dismissalStart = employee.hierarchyHistory.find((h) => h.motive == 'DEM')?.startDate;
        const dismissal = employee.status == 'INACTIVE';

        if (dismissal && dismissalStart) {
          employee.expiredDateExam = dismissalStart;

          const demExamIndex = employee.examsHistory.findIndex((exam) => {
            if (exam.examType == 'DEMI') return true;
            return false;
          });

          const isDone = employee.examsHistory[demExamIndex]?.status == 'DONE';
          const isDismissalLastExam = demExamIndex != -1 && employee.examsHistory.length - 1 == demExamIndex;

          if (isDismissalLastExam && isDone) {
            employee.expiredDateExam = null;
          }
        }

        return;
      }

      if (hasExam) {
        // > add expired Date
        {
          const doneExamFound = employee.examsHistory.find((exam) => {
            const isDone = exam.status === 'DONE';
            if (isDone) return true;
            return false;
          });

          const scheduleExamFound = employee.examsHistory.find((exam) => {
            const isSchedule = ['PROCESSING', 'PENDING'].includes(exam.status);
            if (!isSchedule) return false;

            const isDoneDateValid = this.dayjs.dayjs(exam.doneDate).isAfter(this.dayjs.dateNow());
            if (!isDoneDateValid) return false;

            return true;
          });

          // >> logic newExamAdded
          {
            if (employee.newExamAdded && doneExamFound) {
              const doneDateExam = doneExamFound.doneDate;
              if (doneDateExam <= employee.newExamAdded) {
                doneExamFound.expiredDate = employee.newExamAdded;
              }
            }
          }
          // >> logic newExamAdded

          if (doneExamFound) employee.expiredDateExam = doneExamFound.expiredDate;
          if (!doneExamFound && scheduleExamFound && employee.lastExam) {
            const expiredDate = this.dayjs.dayjs(employee.lastExam).add(scheduleExamFound.validityInMonths, 'month').toDate();
            employee.expiredDateExam = expiredDate;
          }
        }
        // > add expired Date
      }

      if (missingExam) {
        allWithMissingExam.push(employee);
      }
    });

    const exams =
      allWithMissingExam.length != 0
        ? await this.findExamByHierarchyService.execute(
          { targetCompanyId: companyId },
          {
            onlyAttendance: true,
          },
        )
        : undefined;

    const getExpired = allWithMissingExam.map((employee) => {
      const ids = [...employee.subOffices.map(({ id }) => id), employee.hierarchyId];

      let expiredDate: Date;
      if (exams)
        exams.data.find(({ exam, origins }) => {
          if (!exam.isAttendance) return false;

          origins.find((origin) => {
            const isPartOfHomo = origin?.homogeneousGroup
              ? origin.homogeneousGroup?.hierarchyOnHomogeneous?.find((homoHier) => ids.includes(homoHier?.hierarchy?.id))
              : true;
            if (!isPartOfHomo) return;

            const skip = this.findExamByHierarchyService.checkIfSkipEmployee(origin, employee);
            if (skip) return;

            const expired = this.findExamByHierarchyService.checkExpiredDate(origin, employee);
            if (!expired.expiredDate) return;
            expiredDate = expired.expiredDate;
            return true;
          });
        });

      const expired = expiredDate ? { expiredDate } : {};

      if (expiredDate) employee.expiredDateExam = expiredDate;
      return { ...employee, ...expired };
    });

    const missingExamExpired = getExpired.filter((e) => {
      if (!e.expiredDate) return true;

      const lastExamValid = this.dayjs.dayjs(e.expiredDate).isAfter(this.dayjs.dayjs());

      if (!lastExamValid) return true;
      return false;
    });

    await asyncBatch(allEmployees, 100, async (e) => {
      if (e.expiredDateExam && e.expiredDateExam != e.expiredDateExamOld)
        await this.employeeRepository.updateNude({
          where: { id: e.id },
          data: { expiredDateExam: e.expiredDateExam },
        });
      if (e.expiredDateExam === null && e.expiredDateExamOld != date)
        await this.employeeRepository.updateNude({
          where: { id: e.id },
          data: { expiredDateExam: date },
        });
    });

    return {
      all: allEmployees,
      allWithMissingExam,
      missingExamExpired,
    };
  }
}
