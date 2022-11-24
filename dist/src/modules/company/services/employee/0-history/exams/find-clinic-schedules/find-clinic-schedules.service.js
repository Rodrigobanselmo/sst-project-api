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
exports.FindClinicScheduleEmployeeExamHistoryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const EmployeeExamsHistoryRepository_1 = require("../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
const EmployeeRepository_1 = require("./../../../../../repositories/implementations/EmployeeRepository");
let FindClinicScheduleEmployeeExamHistoryService = class FindClinicScheduleEmployeeExamHistoryService {
    constructor(employeeExamHistoryRepository, employeeRepository) {
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
        this.employeeRepository = employeeRepository;
    }
    async execute(query, user) {
        const companyId = user.targetCompanyId;
        const status = [client_1.StatusEnum.DONE, client_1.StatusEnum.PROCESSING, client_1.StatusEnum.INACTIVE];
        const employees = await this.employeeRepository.findNude({
            select: {
                name: true,
                id: true,
                cpf: true,
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
                examsHistory: {
                    select: {
                        id: true,
                        doneDate: true,
                        fileUrl: true,
                        conclusion: true,
                        examType: true,
                        doctor: {
                            select: { professional: { select: { id: true, name: true } } },
                        },
                        exam: { select: { id: true, name: true, isAttendance: true } },
                        time: true,
                        evaluationType: true,
                        status: true,
                    },
                    where: Object.assign({ status: { in: status } }, (query.date && { doneDate: query.date })),
                    orderBy: { doneDate: 'desc' },
                    distinct: ['examId'],
                },
            },
            where: Object.assign(Object.assign({}, (query.employeeId && { id: query.employeeId })), { examsHistory: {
                    some: Object.assign({ clinicId: companyId, status: { in: status } }, (query.date && { doneDate: query.date })),
                } }),
        });
        return employees;
    }
};
FindClinicScheduleEmployeeExamHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository, EmployeeRepository_1.EmployeeRepository])
], FindClinicScheduleEmployeeExamHistoryService);
exports.FindClinicScheduleEmployeeExamHistoryService = FindClinicScheduleEmployeeExamHistoryService;
//# sourceMappingURL=find-clinic-schedules.service.js.map