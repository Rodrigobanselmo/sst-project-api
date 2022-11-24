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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyReportRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const report_entity_1 = require("../../entities/report.entity");
let CompanyReportRepository = class CompanyReportRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert({ companyId, dailyReport, lastDailyReport }, options = {}) {
        const report = await this.prisma.companyReport.upsert(Object.assign({ where: { companyId }, create: { lastDailyReport, dailyReport: dailyReport, companyId }, update: { lastDailyReport, dailyReport: dailyReport, companyId } }, options));
        return new report_entity_1.CompanyReportEntity(report);
    }
    async updateESocial(companyId, removePending = 0, options = {}) {
        var _a, _b, _c, _d, _e;
        let report = await this.prisma.companyReport.findFirst({
            where: { companyId },
        });
        if (!report) {
            report = await this.upsert({
                companyId,
                dailyReport: { esocial: {}, exam: {} },
            });
        }
        const dailyReport = ((report === null || report === void 0 ? void 0 : report.dailyReport) || {
            esocial: {},
            exam: {},
        });
        const group = await this.prisma.employeeESocialEvent.groupBy({
            by: ['status'],
            _count: true,
        });
        const done = ((_a = group.find((g) => g.status === 'DONE')) === null || _a === void 0 ? void 0 : _a._count) || 0;
        const transmitted = ((_b = group.find((g) => g.status === 'TRANSMITTED')) === null || _b === void 0 ? void 0 : _b._count) || 0;
        const processing = ((_c = group.find((g) => g.status === 'PROCESSING')) === null || _c === void 0 ? void 0 : _c._count) || 0;
        const rejected = ((_d = group.find((g) => g.status === 'INVALID' || g.status === 'ERROR')) === null || _d === void 0 ? void 0 : _d._count) || 0;
        if (typeof done == 'number')
            dailyReport.esocial.done = done;
        if (typeof rejected == 'number')
            dailyReport.esocial.rejected = rejected;
        if (typeof processing == 'number')
            dailyReport.esocial.processing = processing;
        if (typeof transmitted == 'number')
            dailyReport.esocial.transmitted = transmitted;
        dailyReport.esocial.pending = (((_e = dailyReport.esocial) === null || _e === void 0 ? void 0 : _e.pending) || 0) - removePending;
        if (dailyReport.esocial.pending < 0)
            dailyReport.esocial.pending = 0;
        await this.prisma.companyReport.update(Object.assign({ where: { companyId }, data: { dailyReport: dailyReport } }, options));
        return new report_entity_1.CompanyReportEntity(report);
    }
    async updateESocialReport(companyId, dailyReport, options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        let report = await this.prisma.companyReport.findFirst({
            where: { companyId },
        });
        if (!report) {
            report = await this.upsert({
                companyId,
                dailyReport: {
                    esocial: {
                        S2220: {},
                        S2240: {},
                        S2210: {},
                    },
                    exam: {},
                },
            });
        }
        const newDailyReport = ((report === null || report === void 0 ? void 0 : report.dailyReport) || {
            esocial: { S2210: {}, S2220: {}, S2240: {} },
            exam: {},
        });
        newDailyReport.esocial = Object.assign(Object.assign(Object.assign({}, newDailyReport.esocial), dailyReport === null || dailyReport === void 0 ? void 0 : dailyReport.esocial), { S2210: Object.assign(Object.assign({}, (_a = newDailyReport === null || newDailyReport === void 0 ? void 0 : newDailyReport.esocial) === null || _a === void 0 ? void 0 : _a.S2210), (_b = dailyReport === null || dailyReport === void 0 ? void 0 : dailyReport.esocial) === null || _b === void 0 ? void 0 : _b.S2210), S2220: Object.assign(Object.assign({}, (_c = newDailyReport === null || newDailyReport === void 0 ? void 0 : newDailyReport.esocial) === null || _c === void 0 ? void 0 : _c.S2220), (_d = dailyReport === null || dailyReport === void 0 ? void 0 : dailyReport.esocial) === null || _d === void 0 ? void 0 : _d.S2220), S2240: Object.assign(Object.assign({}, (_e = newDailyReport === null || newDailyReport === void 0 ? void 0 : newDailyReport.esocial) === null || _e === void 0 ? void 0 : _e.S2240), (_f = dailyReport === null || dailyReport === void 0 ? void 0 : dailyReport.esocial) === null || _f === void 0 ? void 0 : _f.S2240) });
        const esocial = {
            processing: (newDailyReport.esocial.S2210.processing || 0) + (newDailyReport.esocial.S2220.processing || 0) + (newDailyReport.esocial.S2240.processing || 0),
            pending: (newDailyReport.esocial.S2210.pending || 0) + (newDailyReport.esocial.S2220.pending || 0) + (newDailyReport.esocial.S2240.pending || 0),
            done: (newDailyReport.esocial.S2210.done || 0) + (newDailyReport.esocial.S2220.done || 0) + (newDailyReport.esocial.S2240.done || 0),
            transmitted: (newDailyReport.esocial.S2210.transmitted || 0) + (newDailyReport.esocial.S2220.transmitted || 0) + (newDailyReport.esocial.S2240.transmitted || 0),
            rejected: (newDailyReport.esocial.S2210.rejected || 0) + (newDailyReport.esocial.S2220.rejected || 0) + (newDailyReport.esocial.S2240.rejected || 0),
        };
        newDailyReport.esocial = Object.assign(Object.assign({}, newDailyReport.esocial), esocial);
        newDailyReport.exam = Object.assign(Object.assign({}, newDailyReport.exam), dailyReport === null || dailyReport === void 0 ? void 0 : dailyReport.exam);
        await this.prisma.companyReport.update(Object.assign({ where: { companyId }, data: {
                dailyReport: newDailyReport,
                esocialDone: ((_g = newDailyReport.esocial) === null || _g === void 0 ? void 0 : _g.done) || 0,
                esocialPendent: (((_h = newDailyReport.esocial) === null || _h === void 0 ? void 0 : _h.pending) || 0) + (((_j = newDailyReport.esocial) === null || _j === void 0 ? void 0 : _j.transmitted) || 0),
                esocialProgress: ((_k = newDailyReport.esocial) === null || _k === void 0 ? void 0 : _k.processing) || 0,
                esocialReject: ((_l = newDailyReport.esocial) === null || _l === void 0 ? void 0 : _l.rejected) || 0,
            } }, options));
        return new report_entity_1.CompanyReportEntity(report);
    }
    async getESocialNewReport(companyId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const esocial = {
            ['S2210']: {},
            ['S2220']: {},
            ['S2240']: {},
        };
        const group = await this.prisma.employeeESocialEvent.groupBy({
            by: ['status', 'type'],
            where: { companyId },
            _count: true,
        });
        const doneRisk = ((_a = group.find((g) => g.status === 'DONE' && g.type === 'RISK_2240')) === null || _a === void 0 ? void 0 : _a._count) || 0;
        const doneExam = ((_b = group.find((g) => g.status === 'DONE' && g.type === 'EXAM_2220')) === null || _b === void 0 ? void 0 : _b._count) || 0;
        const doneCat = ((_c = group.find((g) => g.status === 'DONE' && g.type === 'CAT_2210')) === null || _c === void 0 ? void 0 : _c._count) || 0;
        const transmittedRisk = ((_d = group.find((g) => g.status === 'TRANSMITTED' && g.type === 'RISK_2240')) === null || _d === void 0 ? void 0 : _d._count) || 0;
        const transmittedExam = ((_e = group.find((g) => g.status === 'TRANSMITTED' && g.type === 'EXAM_2220')) === null || _e === void 0 ? void 0 : _e._count) || 0;
        const transmittedCat = ((_f = group.find((g) => g.status === 'TRANSMITTED' && g.type === 'CAT_2210')) === null || _f === void 0 ? void 0 : _f._count) || 0;
        const processingRisk = ((_g = group.find((g) => g.status === 'PROCESSING' && g.type === 'RISK_2240')) === null || _g === void 0 ? void 0 : _g._count) || 0;
        const processingExam = ((_h = group.find((g) => g.status === 'PROCESSING' && g.type === 'EXAM_2220')) === null || _h === void 0 ? void 0 : _h._count) || 0;
        const processingCat = ((_j = group.find((g) => g.status === 'PROCESSING' && g.type === 'CAT_2210')) === null || _j === void 0 ? void 0 : _j._count) || 0;
        const rejectedRisk = ((_k = group.find((g) => (g.status === 'INVALID' || g.status === 'ERROR') && g.type === 'RISK_2240')) === null || _k === void 0 ? void 0 : _k._count) || 0;
        const rejectedExam = ((_l = group.find((g) => (g.status === 'INVALID' || g.status === 'ERROR') && g.type === 'EXAM_2220')) === null || _l === void 0 ? void 0 : _l._count) || 0;
        const rejectedCat = ((_m = group.find((g) => (g.status === 'INVALID' || g.status === 'ERROR') && g.type === 'CAT_2210')) === null || _m === void 0 ? void 0 : _m._count) || 0;
        esocial.S2240.done = doneRisk;
        esocial.S2240.rejected = rejectedRisk;
        esocial.S2240.processing = processingRisk;
        esocial.S2240.transmitted = transmittedRisk;
        esocial.S2220.done = doneExam;
        esocial.S2220.rejected = rejectedExam;
        esocial.S2220.processing = processingExam;
        esocial.S2220.transmitted = transmittedExam;
        esocial.S2210.done = doneCat;
        esocial.S2210.rejected = rejectedCat;
        esocial.S2210.processing = processingCat;
        esocial.S2210.transmitted = transmittedCat;
        return esocial;
    }
    async findNude(options = {}) {
        const reports = await this.prisma.companyReport.findMany(options);
        return reports.map((exam) => new report_entity_1.CompanyReportEntity(exam));
    }
    async findFirstNude(options = {}) {
        const report = await this.prisma.companyReport.findFirst(options);
        return new report_entity_1.CompanyReportEntity(report);
    }
    async findAllGroupBy() {
        const report = await this.prisma.companyReport.groupBy({
            by: ['companyId'],
        });
        return report;
    }
};
CompanyReportRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyReportRepository);
exports.CompanyReportRepository = CompanyReportRepository;
//# sourceMappingURL=CompanyReportRepository.js.map