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
exports.FindScheduleEmployeeExamHistoryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const EmployeeExamsHistoryRepository_1 = require("../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
let FindScheduleEmployeeExamHistoryService = class FindScheduleEmployeeExamHistoryService {
    constructor(employeeExamHistoryRepository) {
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
    }
    async execute(_a, user) {
        var { skip, take, allExams } = _a, query = __rest(_a, ["skip", "take", "allExams"]);
        const companyId = user.targetCompanyId;
        const status = [client_1.StatusEnum.PENDING];
        if (allExams)
            status.push(client_1.StatusEnum.PROCESSING);
        const access = await this.employeeExamHistoryRepository.find(Object.assign({ companyId: companyId, status }, query), { skip, take }, Object.assign(Object.assign({ orderBy: { created_at: 'asc' } }, (!allExams && { distinct: ['employeeId'] })), { select: Object.assign(Object.assign(Object.assign({ id: true, status: true, created_at: true, fileUrl: true }, (allExams && {
                exam: { select: { name: true, id: true, isAttendance: true } },
                hierarchy: { select: { id: true, name: true } },
                subOffice: { select: { id: true, name: true } },
                time: true,
                doneDate: true,
                clinicId: true,
                clinicObs: true,
                scheduleType: true,
            })), { examType: true }), (!allExams && {
                userSchedule: { select: { name: true, email: true, id: true } },
                employee: {
                    select: {
                        name: true,
                        id: true,
                        cpf: true,
                        company: {
                            select: {
                                cnpj: true,
                                name: true,
                                id: true,
                                fantasy: true,
                                initials: true,
                                address: { select: { state: true } },
                            },
                        },
                    },
                },
            })) }));
        return access;
    }
};
FindScheduleEmployeeExamHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository])
], FindScheduleEmployeeExamHistoryService);
exports.FindScheduleEmployeeExamHistoryService = FindScheduleEmployeeExamHistoryService;
//# sourceMappingURL=find-schedule.service.js.map