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
exports.UpdateManyScheduleExamHistoryService = void 0;
const compareFieldValues_1 = require("./../../../../../../../shared/utils/compareFieldValues");
const message_enum_1 = require("./../../../../../../../shared/constants/enum/message.enum");
const NotificationRepository_1 = require("./../../../../../../notifications/repositories/implementations/NotificationRepository");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const DayJSProvider_1 = require("../../../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const EmployeeExamsHistoryRepository_1 = require("../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
const EmployeeRepository_1 = require("../../../../../repositories/implementations/EmployeeRepository");
const create_service_1 = require("../../hierarchy/create/create.service");
const errorMessage_1 = require("./../../../../../../../shared/constants/enum/errorMessage");
let UpdateManyScheduleExamHistoryService = class UpdateManyScheduleExamHistoryService {
    constructor(employeeExamHistoryRepository, employeeRepository, createEmployeeHierarchyHistoryService, dayJSProvider, notificationRepository) {
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
        this.employeeRepository = employeeRepository;
        this.createEmployeeHierarchyHistoryService = createEmployeeHierarchyHistoryService;
        this.dayJSProvider = dayJSProvider;
        this.notificationRepository = notificationRepository;
    }
    async execute(_a, user) {
        var _b;
        var { data, isClinic } = _a, dataDto = __rest(_a, ["data", "isClinic"]);
        const employeeId = data.every((dt) => { var _a; return ((_a = data === null || data === void 0 ? void 0 : data[0]) === null || _a === void 0 ? void 0 : _a.employeeId) === (dt === null || dt === void 0 ? void 0 : dt.employeeId); }) ? (_b = data[0]) === null || _b === void 0 ? void 0 : _b.employeeId : 0;
        const allExamsIds = data.map((dt) => dt.id);
        const found = await this.employeeRepository.findFirstNude({
            select: {
                id: true,
                companyId: true,
                examsHistory: { where: { id: { in: allExamsIds } } },
            },
            where: Object.assign(Object.assign({}, (isClinic && {
                OR: [{ examsHistory: { some: { clinicId: user.targetCompanyId } } }, { companyId: user.targetCompanyId }],
                id: employeeId,
            })), (!isClinic && {
                companyId: user.targetCompanyId,
                id: employeeId,
            })),
        });
        if (!(found === null || found === void 0 ? void 0 : found.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_NOT_FOUND);
        await this.employeeRepository.update(Object.assign({ companyId: found.companyId, id: employeeId }, dataDto));
        data = data.map((exam) => {
            const foundExam = found.examsHistory.find((e) => e.id === exam.id);
            const isEqual = (0, compareFieldValues_1.compareFieldValues)(foundExam, exam, {
                fields: compareFieldValues_1.checkExamFields,
            });
            return Object.assign(Object.assign({}, (isEqual && { sendEvent: true })), exam);
        });
        const history = await this.employeeExamHistoryRepository.updateMany({
            data,
        });
        try {
            await this.changeHierarchy(Object.assign({ data, isClinic }, dataDto), user, found);
        }
        catch (err) {
            console.error(err);
        }
        try {
            await this.sendNotification(Object.assign({ data, isClinic }, dataDto), user, found);
        }
        catch (err) {
            console.error(err);
        }
        return history;
    }
    async changeHierarchy(dataDto, user, employee) {
        const clinicExam = dataDto.data.find((e) => e.evaluationType === client_1.ExamHistoryEvaluationEnum.APTO);
        if (!(clinicExam === null || clinicExam === void 0 ? void 0 : clinicExam.id))
            return;
        const clinicHistory = await this.employeeExamHistoryRepository.findUniqueNude({
            where: { id: clinicExam.id },
        });
        if (clinicExam === null || clinicExam === void 0 ? void 0 : clinicExam.changeHierarchyAnyway)
            return;
        if (clinicHistory.hierarchyId)
            await this.createEmployeeHierarchyHistoryService.execute({
                employeeId: employee.id,
                hierarchyId: clinicHistory.hierarchyId,
                motive: clinicHistory.examType === 'ADMI' ? 'ADM' : 'TRANS_PROM',
                startDate: (clinicHistory === null || clinicHistory === void 0 ? void 0 : clinicHistory.changeHierarchyDate) || this.dayJSProvider.dateNow(),
                subOfficeId: clinicHistory.subOfficeId,
            }, Object.assign(Object.assign({}, user), { targetCompanyId: employee.companyId }));
        if (clinicHistory.examType === 'DEMI' && !clinicHistory.hierarchyId)
            await this.createEmployeeHierarchyHistoryService.execute({
                employeeId: employee.id,
                hierarchyId: null,
                motive: 'DEM',
                startDate: (clinicHistory === null || clinicHistory === void 0 ? void 0 : clinicHistory.changeHierarchyDate) || this.dayJSProvider.dateNow(),
            }, Object.assign(Object.assign({}, user), { targetCompanyId: employee.companyId }));
    }
    async sendNotification(dataDto, user, employee) {
        dataDto;
        if (dataDto === null || dataDto === void 0 ? void 0 : dataDto.isClinic)
            return;
        const examData = dataDto.data.find((e) => e.status === client_1.StatusEnum.PROCESSING);
        if (!(examData === null || examData === void 0 ? void 0 : examData.id))
            return;
        const message = {
            message: 'Seus exames tiveram o status alterado para "agendado", verifique sua agenda para mais informações',
            title: 'Pedido de agenda atualizado',
            type: message_enum_1.MessageEnum.SUCCESS,
        };
        this.notificationRepository.create({
            companyId: user.companyId,
            json: message,
            isCompany: true,
            companiesIds: [user.targetCompanyId],
            repeatId: 'schedule_status_pending',
        });
    }
};
UpdateManyScheduleExamHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository,
        EmployeeRepository_1.EmployeeRepository,
        create_service_1.CreateEmployeeHierarchyHistoryService,
        DayJSProvider_1.DayJSProvider,
        NotificationRepository_1.NotificationRepository])
], UpdateManyScheduleExamHistoryService);
exports.UpdateManyScheduleExamHistoryService = UpdateManyScheduleExamHistoryService;
//# sourceMappingURL=update-many.service.js.map