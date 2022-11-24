"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAllCompaniesService = void 0;
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
const asyncEach_1 = require("../../../../../shared/utils/asyncEach");
const find_exam_by_hierarchy_service_1 = require("../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service");
const EmployeeRepository_1 = require("../../../repositories/implementations/EmployeeRepository");
const common_1 = require("@nestjs/common");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const nestjs_telegram_1 = require("nestjs-telegram");
const CompanyReportRepository_1 = require("../../../../../modules/company/repositories/implementations/CompanyReportRepository");
const asyncBatch_1 = require("../../../../../shared/utils/asyncBatch");
const ESocialEventProvider_1 = require("../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider");
const update_esocial_report_service_1 = require("../update-esocial-report/update-esocial-report.service");
let UpdateAllCompaniesService = class UpdateAllCompaniesService {
    constructor(employeeRepository, findExamByHierarchyService, companyRepository, dayjs, telegram, eSocialEventProvider, companyReportRepository, updateESocialReportService) {
        this.employeeRepository = employeeRepository;
        this.findExamByHierarchyService = findExamByHierarchyService;
        this.companyRepository = companyRepository;
        this.dayjs = dayjs;
        this.telegram = telegram;
        this.eSocialEventProvider = eSocialEventProvider;
        this.companyReportRepository = companyReportRepository;
        this.updateESocialReportService = updateESocialReportService;
        this.chatId = 1301254235;
        this.standardDate = '1900-01-01';
        this.errorCompanies = [];
    }
    async execute(user) {
        const companyId = user === null || user === void 0 ? void 0 : user.targetCompanyId;
        console.log('start cron(1): update all');
        const allCompanies = await this.companyRepository.findNude({
            select: {
                id: true,
                esocialStart: true,
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
                        company: { select: { cert: true } },
                    },
                },
                applyingServiceContracts: {
                    select: { receivingServiceCompanyId: true },
                },
            },
            where: Object.assign({ status: 'ACTIVE', isClinic: false }, (companyId && {
                OR: [
                    { id: companyId },
                    {
                        receivingServiceContracts: {
                            some: { applyingServiceCompanyId: companyId },
                        },
                    },
                ],
            })),
        });
        console.log('start cron(2): update employees');
        const employeeExams = (await (0, asyncEach_1.asyncEach)(allCompanies, (v) => this.addReport(v))).map(({ company, examTime, esocialEvents }) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const expired = (((_a = examTime === null || examTime === void 0 ? void 0 : examTime.allWithExamExpired) === null || _a === void 0 ? void 0 : _a.length) || 0) + (((_b = examTime === null || examTime === void 0 ? void 0 : examTime.allWithMissingExam) === null || _b === void 0 ? void 0 : _b.length) || 0);
            return {
                company: company,
                companyId: company.id,
                lastDailyReport: this.dayjs.dateNow(),
                dailyReport: {
                    exam: Object.assign({}, (examTime && {
                        all: ((_c = examTime === null || examTime === void 0 ? void 0 : examTime.all) === null || _c === void 0 ? void 0 : _c.length) || 0,
                        expired,
                        good: (((_d = examTime === null || examTime === void 0 ? void 0 : examTime.all) === null || _d === void 0 ? void 0 : _d.length) || 0) - expired,
                        schedule: ((_e = examTime === null || examTime === void 0 ? void 0 : examTime.allWithExamSchedule) === null || _e === void 0 ? void 0 : _e.length) || 0,
                        expired30: ((_f = examTime === null || examTime === void 0 ? void 0 : examTime.closeToExpire30) === null || _f === void 0 ? void 0 : _f.length) || 0,
                        expired90: ((_g = examTime === null || examTime === void 0 ? void 0 : examTime.closeToExpire90) === null || _g === void 0 ? void 0 : _g.length) || 0,
                    })),
                    esocial: Object.assign({}, (esocialEvents && {
                        pending: (esocialEvents === null || esocialEvents === void 0 ? void 0 : esocialEvents.pending) || 0,
                    })),
                },
            };
        });
        const employeeExamsData = employeeExams.map((_a) => {
            var _b;
            var { company } = _a, report = __rest(_a, ["company"]);
            const companyIds = ((_b = company === null || company === void 0 ? void 0 : company.applyingServiceContracts) === null || _b === void 0 ? void 0 : _b.map((c) => c.receivingServiceCompanyId)) || [];
            if (companyIds.length === 0)
                return report;
            employeeExams.forEach((employeeExam) => {
                if (companyIds.includes(employeeExam.companyId)) {
                    Object.entries(employeeExam.dailyReport.exam).map(([k, v]) => {
                        if (typeof v === 'number') {
                            report.dailyReport.exam[k] = report.dailyReport.exam[k] + v;
                        }
                    });
                    Object.entries(employeeExam.dailyReport.esocial).map(([k, v]) => {
                        if (typeof v === 'number') {
                            report.dailyReport.esocial[k] = report.dailyReport.esocial[k] + v;
                        }
                    });
                }
            });
            return report;
        });
        console.log('start cron(3): telegram');
        this.telegramMessage(allCompanies);
        console.log('start cron(4): reports');
        await (0, asyncBatch_1.asyncBatch)(employeeExamsData, 50, async (report) => {
            await this.companyReportRepository.upsert(report);
        });
        console.log('end cron(4): reports');
        this.errorCompanies = [];
        this.error = undefined;
        return employeeExamsData;
    }
    async addReport(company) {
        const examTime = await this.addEmployeeExamTime(company);
        const esocialEvents = await this.addCompanyEsocial(company);
        return { examTime, esocialEvents, company };
    }
    async addEmployeeExamTime(company) {
        const companyId = company.id;
        const date = this.dayjs.dayjs(this.standardDate).toDate();
        try {
            const allEmployees = (await this.employeeRepository.findNude({
                where: {
                    companyId,
                    hierarchyId: { not: null },
                },
                select: {
                    id: true,
                    lastExam: true,
                    expiredDateExam: true,
                    hierarchyId: true,
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
            })).map((e) => (Object.assign(Object.assign({}, e), { expiredDateExamOld: e.expiredDateExam })));
            const allWithExam = [];
            const allWithExamExpired = [];
            const allWithExamSchedule = [];
            const allWithMissingExam = [];
            allEmployees.forEach((employee) => {
                var _a, _b;
                const hasExam = ((_a = employee === null || employee === void 0 ? void 0 : employee.examsHistory) === null || _a === void 0 ? void 0 : _a.length) > 0;
                const missingExam = ((_b = employee === null || employee === void 0 ? void 0 : employee.examsHistory) === null || _b === void 0 ? void 0 : _b.length) == 0;
                if (hasExam) {
                    const doneExamFound = employee.examsHistory.find((exam) => {
                        const isDone = exam.status === 'DONE';
                        if (isDone)
                            return true;
                        return false;
                    });
                    const scheduleExamFound = employee.examsHistory.find((exam) => {
                        const isSchedule = ['PROCESSING', 'PENDING'].includes(exam.status);
                        if (!isSchedule)
                            return false;
                        const isDoneDateValid = this.dayjs.dayjs(exam.doneDate).isAfter(this.dayjs.dateNow());
                        if (!isDoneDateValid)
                            return false;
                        return true;
                    });
                    if (doneExamFound)
                        employee.expiredDateExam = doneExamFound.expiredDate;
                    if (!doneExamFound && scheduleExamFound && employee.lastExam) {
                        const expiredDate = this.dayjs.dayjs(employee.lastExam).add(scheduleExamFound.validityInMonths, 'month').toDate();
                        employee.expiredDateExam = expiredDate;
                    }
                    {
                        allWithExam.push(employee);
                    }
                    {
                        if (doneExamFound) {
                            const isExpired = this.dayjs.dayjs(doneExamFound.expiredDate).isBefore(this.dayjs.dateNow());
                            if (isExpired)
                                allWithExamExpired.push(employee);
                        }
                        else {
                            if (!doneExamFound && scheduleExamFound && employee.lastExam) {
                                const isExpired = this.dayjs.dayjs(employee.expiredDateExam).isBefore(this.dayjs.dateNow());
                                if (isExpired)
                                    allWithExamExpired.push(employee);
                            }
                            else {
                                allWithExamExpired.push(employee);
                            }
                        }
                    }
                    {
                        if (scheduleExamFound)
                            allWithExamSchedule.push(employee);
                    }
                }
                if (missingExam) {
                    allWithMissingExam.push(employee);
                }
            });
            const exams = await this.findExamByHierarchyService.execute({ targetCompanyId: companyId }, {
                onlyAttendance: true,
            });
            const getExpired = allWithMissingExam.map((employee) => {
                const ids = [...employee.subOffices.map(({ id }) => id), employee.hierarchyId];
                let expiredDate;
                exams.data.find(({ exam, origins }) => {
                    if (!exam.isAttendance)
                        return false;
                    origins.find((origin) => {
                        var _a, _b;
                        const isPartOfHomo = (origin === null || origin === void 0 ? void 0 : origin.homogeneousGroup)
                            ? (_b = (_a = origin.homogeneousGroup) === null || _a === void 0 ? void 0 : _a.hierarchyOnHomogeneous) === null || _b === void 0 ? void 0 : _b.find((homoHier) => { var _a; return ids.includes((_a = homoHier === null || homoHier === void 0 ? void 0 : homoHier.hierarchy) === null || _a === void 0 ? void 0 : _a.id); })
                            : true;
                        if (!isPartOfHomo)
                            return;
                        const skip = this.findExamByHierarchyService.checkIfSkipEmployee(origin, employee);
                        if (skip)
                            return;
                        const expired = this.findExamByHierarchyService.checkExpiredDate(origin, employee);
                        if (!expired.expiredDate)
                            return;
                        expiredDate = expired.expiredDate;
                        return true;
                    });
                });
                const expired = expiredDate ? { expiredDate } : {};
                if (expiredDate)
                    employee.expiredDateExam = expiredDate;
                return Object.assign(Object.assign({}, employee), expired);
            });
            const missingExamExpired = getExpired.filter((e) => {
                if (!e.expiredDate)
                    return true;
                const lastExamValid = this.dayjs.dayjs(e.expiredDate).isAfter(this.dayjs.dayjs());
                if (!lastExamValid)
                    return true;
                return false;
            });
            await (0, asyncBatch_1.asyncBatch)(allEmployees, 100, async (e) => {
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
                    if (!e.expiredDateExam)
                        return;
                    return this.dayjs.dayjs(_30_DaysFromNow).isAfter(e.expiredDateExam) && this.dayjs.dayjs().isBefore(e.expiredDateExam);
                }),
                closeToExpire90: allEmployees.filter((e) => {
                    if (!e.expiredDateExam)
                        return;
                    const _90_DaysFromNow = this.dayjs.addDay(this.dayjs.dateNow(), 90);
                    return this.dayjs.dayjs(_90_DaysFromNow).isAfter(e.expiredDateExam) && this.dayjs.dayjs(_30_DaysFromNow).isBefore(e.expiredDateExam);
                }),
            };
        }
        catch (e) {
            this.errorCompanies.push(companyId);
            this.error = e;
        }
    }
    async addCompanyEsocial(company) {
        const companyId = company.id;
        if (!company.esocialStart)
            return {};
        try {
            const esocial = await this.updateESocialReportService.addCompanyEsocial(company);
            return esocial;
        }
        catch (e) {
            this.errorCompanies.push(companyId);
            this.error = e;
        }
    }
    async telegramMessage(allCompanies) {
        return;
        try {
            const messageHtml = this.errorCompanies.length
                ? `
UPDATE ALL COMPANIES EXAMS:

DONE: ${allCompanies.length - this.errorCompanies.length}
ERRORS: ${this.errorCompanies.length}
TOTAL: ${allCompanies.length}
      `
                : 'ALL GOOD';
            await this.telegram
                .sendMessage({
                chat_id: this.chatId,
                text: messageHtml,
                parse_mode: 'html',
            })
                .toPromise();
        }
        catch (e) {
            console.error('TELEGRAM', e);
        }
    }
};
UpdateAllCompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeRepository_1.EmployeeRepository,
        find_exam_by_hierarchy_service_1.FindExamByHierarchyService,
        CompanyRepository_1.CompanyRepository,
        DayJSProvider_1.DayJSProvider,
        nestjs_telegram_1.TelegramService,
        ESocialEventProvider_1.ESocialEventProvider,
        CompanyReportRepository_1.CompanyReportRepository,
        update_esocial_report_service_1.UpdateESocialReportService])
], UpdateAllCompaniesService);
exports.UpdateAllCompaniesService = UpdateAllCompaniesService;
//# sourceMappingURL=update-all-companies.service.js.map