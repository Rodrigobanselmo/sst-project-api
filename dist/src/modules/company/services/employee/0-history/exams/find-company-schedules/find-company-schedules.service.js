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
exports.FindCompanyScheduleEmployeeExamHistoryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const EmployeeExamsHistoryRepository_1 = require("../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
const EmployeeRepository_1 = require("../../../../../repositories/implementations/EmployeeRepository");
let FindCompanyScheduleEmployeeExamHistoryService = class FindCompanyScheduleEmployeeExamHistoryService {
    constructor(employeeExamHistoryRepository, employeeRepository) {
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
        this.employeeRepository = employeeRepository;
    }
    async execute(_a, user) {
        var { skip, take } = _a, query = __rest(_a, ["skip", "take"]);
        const employeesExams = await this.employeeExamHistoryRepository.find(Object.assign(Object.assign({}, query), { companyId: user.targetCompanyId, userCompany: user.companyId }), { skip, take }, {
            select: {
                id: true,
                doneDate: true,
                examType: true,
                clinicId: true,
                employeeId: true,
                hierarchyId: true,
                subOfficeId: true,
                exam: { select: { id: true, name: true, isAttendance: true } },
                status: true,
                employee: {
                    select: {
                        name: true,
                        id: true,
                        cpf: true,
                        companyId: true,
                        birthday: true,
                        phone: true,
                        sex: true,
                        company: {
                            select: {
                                name: true,
                                initials: true,
                                fantasy: true,
                                id: true,
                                cnpj: true,
                            },
                        },
                    },
                },
            },
            where: {
                AND: [
                    {
                        status: {
                            notIn: [client_1.StatusEnum.PENDING, client_1.StatusEnum.CANCELED],
                        },
                    },
                ],
            },
            orderBy: [{ status: 'asc' }, { doneDate: 'desc' }],
            distinct: ['doneDate', 'employeeId'],
        });
        return employeesExams;
    }
};
FindCompanyScheduleEmployeeExamHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository, EmployeeRepository_1.EmployeeRepository])
], FindCompanyScheduleEmployeeExamHistoryService);
exports.FindCompanyScheduleEmployeeExamHistoryService = FindCompanyScheduleEmployeeExamHistoryService;
//# sourceMappingURL=find-company-schedules.service.js.map