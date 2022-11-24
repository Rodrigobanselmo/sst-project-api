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
exports.CreateEmployeeExamHistoryService = void 0;
const NotificationRepository_1 = require("./../../../../../../notifications/repositories/implementations/NotificationRepository");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const errorMessage_1 = require("../../../../../../../shared/constants/enum/errorMessage");
const EmployeeRepository_1 = require("../../../../../repositories/implementations/EmployeeRepository");
const create_service_1 = require("../../hierarchy/create/create.service");
const EmployeeExamsHistoryRepository_1 = require("./../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
let CreateEmployeeExamHistoryService = class CreateEmployeeExamHistoryService {
    constructor(employeeExamHistoryRepository, employeeRepository, createEmployeeHierarchyHistoryService, notificationRepository) {
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
        this.employeeRepository = employeeRepository;
        this.createEmployeeHierarchyHistoryService = createEmployeeHierarchyHistoryService;
        this.notificationRepository = notificationRepository;
    }
    async execute(dataDto, user) {
        const found = await this.employeeRepository.findById(dataDto.employeeId, user.targetCompanyId);
        if (!(found === null || found === void 0 ? void 0 : found.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_NOT_FOUND);
        await this.checkOtherSchedulesAndCancel(dataDto, found);
        await this.changeHierarchy(dataDto, user);
        const history = await this.employeeExamHistoryRepository.create(Object.assign(Object.assign({}, dataDto), this.getUser(dataDto, user)));
        return history;
    }
    getUser(dataDto, user) {
        var _a, _b;
        const status = dataDto.status || ((_b = (_a = dataDto.examsData) === null || _a === void 0 ? void 0 : _a.find((e) => e.status)) === null || _b === void 0 ? void 0 : _b.status);
        const isUserScheduleId = status && [client_1.StatusEnum.PENDING, client_1.StatusEnum.PROCESSING].includes(status);
        const isUserDoneId = !status || (status && [client_1.StatusEnum.DONE, client_1.StatusEnum.CANCELED].includes(status));
        return Object.assign(Object.assign({}, (isUserDoneId && {
            userDoneId: user.userId,
        })), (isUserScheduleId && {
            userScheduleId: user.userId,
        }));
    }
    async checkOtherSchedulesAndCancel(dataDto, employee) {
        const examsIds = dataDto.examsData.map((x) => x.examId);
        if (dataDto.examId)
            examsIds.push(dataDto.examId);
        const oldSchedules = await this.employeeExamHistoryRepository.findNude({
            where: {
                status: { in: ['PROCESSING', 'PENDING'] },
                employeeId: employee.id,
                examId: { in: examsIds },
            },
        });
        const cancelIds = oldSchedules.map((e) => e.id);
        await this.employeeExamHistoryRepository.updateByIds({
            data: { status: client_1.StatusEnum.CANCELED },
            where: { id: { in: cancelIds } },
        });
    }
    async changeHierarchy(dataDto, user) {
        if (dataDto.changeHierarchyAnyway && dataDto.changeHierarchyDate && dataDto.hierarchyId)
            await this.createEmployeeHierarchyHistoryService.execute({
                employeeId: dataDto.employeeId,
                hierarchyId: dataDto.hierarchyId,
                motive: dataDto.examType === 'ADMI' ? 'ADM' : 'TRANS_PROM',
                startDate: dataDto.changeHierarchyDate,
                subOfficeId: dataDto.subOfficeId,
            }, user);
        if (dataDto.examType === 'DEMI' && dataDto.changeHierarchyDate && !dataDto.hierarchyId)
            await this.createEmployeeHierarchyHistoryService.execute({
                employeeId: dataDto.employeeId,
                hierarchyId: null,
                motive: 'DEM',
                startDate: dataDto.changeHierarchyDate,
            }, user);
    }
};
CreateEmployeeExamHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository,
        EmployeeRepository_1.EmployeeRepository,
        create_service_1.CreateEmployeeHierarchyHistoryService,
        NotificationRepository_1.NotificationRepository])
], CreateEmployeeExamHistoryService);
exports.CreateEmployeeExamHistoryService = CreateEmployeeExamHistoryService;
//# sourceMappingURL=create.service.js.map