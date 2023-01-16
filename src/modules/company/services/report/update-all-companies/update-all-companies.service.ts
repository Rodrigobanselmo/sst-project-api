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

@Injectable()
export class UpdateAllCompaniesService {
  private chatId = 1301254235;
  private standardDate = '1900-01-01';
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
  ) {}

  async execute(user?: UserPayloadDto) {
    const companyId = '9d5354b1-f4bf-4758-8bb6-73ed59ef3444' || user?.targetCompanyId;

    console.info('start cron(1): update all');
    const allCompanies = await this.companyRepository.findNude({
      select: {
        id: true,
        // report: { select: { id: true } },
        esocialStart: true,
        cnpj: true,
        // esocialEvents:{select:{}}.
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

    console.info('start cron(2): update employees');
    const employeeExams = (await asyncEach(allCompanies, (v) => this.addReport(v))).map(
      ({ company, examTime, esocialEvents }): UpsertCompanyReportDto & { company: CompanyEntity } => {
        const expired = (examTime?.allWithExamExpired?.length || 0) + (examTime?.allWithMissingExam?.length || 0);

        return {
          company: company,
          companyId: company.id,
          lastDailyReport: this.dayjs.dateNow(),
          dailyReport: {
            exam: {
              ...(examTime && {
                all: examTime?.all?.length || 0,
                expired,
                good: (examTime?.all?.length || 0) - expired,
                schedule: examTime?.allWithExamSchedule?.length || 0,
                expired30: examTime?.closeToExpire30?.length || 0,
                expired90: examTime?.closeToExpire90?.length || 0,
              }),
            },
            esocial: {
              ...esocialEvents,
            },
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

  // async updateExam(company: CompanyEntity) {
  //   //! optimization here => query only once employees and then apply filters
  //   const examTime = await this.addEmployeeExamTime(company);
  //   const esocialEvents = await this.addCompanyEsocial(company);

  //   return { examTime, esocialEvents, company };
  // }

  async addReport(company: CompanyEntity) {
    //! optimization here => query only once employees and then apply filters
    const examTime = await this.addEmployeeExamTime(company);
    const esocialEvents = await this.addCompanyEsocial(company);

    return { examTime, esocialEvents, company };
  }

  async addEmployeeExamTime(company: CompanyEntity) {
    const companyId = company.id;
    const date = this.dayjs.dayjs(this.standardDate).toDate();
    try {
      const allEmployees = (
        await this.employeeRepository.findNude({
          where: {
            companyId,
            hierarchyId: { not: null }, // dismissal not on where
          },
          select: {
            id: true,
            lastExam: true,
            expiredDateExam: true,
            hierarchyId: true,
            newExamAdded: true,
            subOffices: { select: { id: true } },
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

      const allWithExam = [] as EmployeeEntity[];
      const allWithExamExpired = [] as EmployeeEntity[];
      const allWithExamSchedule = [] as EmployeeEntity[];

      const allWithMissingExam = [] as EmployeeEntity[];

      allEmployees.forEach((employee) => {
        const hasExam = employee?.examsHistory?.length > 0;
        const missingExam = employee?.examsHistory?.length == 0;

        if (hasExam) {
          //--> add expired Date
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

          {
            if (doneExamFound) {
              const doneDateExam = doneExamFound.doneDate;
              if (doneDateExam <= employee.newExamAdded) {
                employee.expiredDateExam = doneExamFound.expiredDate;
              }

              doneExamFound.expiredDate = employee.newExamAdded;
            }
          }

          if (doneExamFound) employee.expiredDateExam = doneExamFound.expiredDate;
          if (!doneExamFound && scheduleExamFound && employee.lastExam) {
            const expiredDate = this.dayjs.dayjs(employee.lastExam).add(scheduleExamFound.validityInMonths, 'month').toDate();
            employee.expiredDateExam = expiredDate;
          }
          //--> add expired Date

          // allWithExam
          {
            allWithExam.push(employee);
          }

          // allWithExamExpired
          {
            if (doneExamFound) {
              const isExpired = this.dayjs.dayjs(doneExamFound.expiredDate).isBefore(this.dayjs.dateNow());

              if (isExpired) allWithExamExpired.push(employee);
            } else {
              if (!doneExamFound && scheduleExamFound && employee.lastExam) {
                const isExpired = this.dayjs.dayjs(employee.expiredDateExam).isBefore(this.dayjs.dateNow());

                if (isExpired) allWithExamExpired.push(employee);
              } else {
                allWithExamExpired.push(employee);
              }
            }
          }

          // allWithExamSchedule
          {
            if (scheduleExamFound) allWithExamSchedule.push(employee);
          }
        }

        // missingExam
        if (missingExam) {
          allWithMissingExam.push(employee);
        }
      });

      const exams = await this.findExamByHierarchyService.execute(
        { targetCompanyId: companyId },
        {
          onlyAttendance: true,
        },
      );

      const getExpired = allWithMissingExam.map((employee) => {
        const ids = [...employee.subOffices.map(({ id }) => id), employee.hierarchyId];

        let expiredDate: Date;
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

      const _30_DaysFromNow = this.dayjs.addDay(this.dayjs.dateNow(), 30);
      return {
        company,
        all: allEmployees,
        allWithExam,
        allWithExamExpired,
        allWithExamSchedule,
        allWithMissingExam,
        missingExamExpired,
        closeToExpire30: allEmployees.filter((e) => {
          if (!e.expiredDateExam) return;

          return this.dayjs.dayjs(_30_DaysFromNow).isAfter(e.expiredDateExam) && this.dayjs.dayjs().isBefore(e.expiredDateExam);
        }),
        closeToExpire90: allEmployees.filter((e) => {
          if (!e.expiredDateExam) return;
          const _90_DaysFromNow = this.dayjs.addDay(this.dayjs.dateNow(), 90);

          return this.dayjs.dayjs(_90_DaysFromNow).isAfter(e.expiredDateExam) && this.dayjs.dayjs(_30_DaysFromNow).isBefore(e.expiredDateExam);
        }),
      };
    } catch (e) {
      this.errorCompanies.push(companyId);
      this.error = e;
    }
  }

  async addCompanyEsocial(company: CompanyEntity) {
    const companyId = company.id;
    if (!company.esocialStart) return {};

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
}
