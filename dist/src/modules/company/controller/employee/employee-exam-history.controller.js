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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeExamHistoryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const employee_exam_history_1 = require("../../dto/employee-exam-history");
const create_service_1 = require("../../services/employee/0-history/exams/create/create.service");
const delete_exam_file_service_1 = require("../../services/employee/0-history/exams/delete-exam-file/delete-exam-file.service");
const delete_service_1 = require("../../services/employee/0-history/exams/delete/delete.service");
const download_exam_service_1 = require("../../services/employee/0-history/exams/download-exam/download-exam.service");
const find_by_id_service_1 = require("../../services/employee/0-history/exams/find-by-id/find-by-id.service");
const find_clinic_schedules_service_1 = require("../../services/employee/0-history/exams/find-clinic-schedules/find-clinic-schedules.service");
const find_company_schedules_service_1 = require("../../services/employee/0-history/exams/find-company-schedules/find-company-schedules.service");
const find_schedule_service_1 = require("../../services/employee/0-history/exams/find-schedule/find-schedule.service");
const find_service_1 = require("../../services/employee/0-history/exams/find/find.service");
const update_many_service_1 = require("../../services/employee/0-history/exams/update-many/update-many.service");
const update_service_1 = require("../../services/employee/0-history/exams/update/update.service");
const upload_exam_file_service_1 = require("../../services/employee/0-history/exams/upload-exam-file/upload-exam-file.service");
let EmployeeExamHistoryController = class EmployeeExamHistoryController {
    constructor(createEmployeeExamHistoryService, updateEmployeeExamHistoryService, findEmployeeExamHistoryService, findAskEmployeeExamHistoryService, findClinicScheduleEmployeeExamHistoryService, findCompanyScheduleEmployeeExamHistoryService, findByIdEmployeeExamHistoryService, deleteEmployeeExamHistoryService, updateManyScheduleExamHistoryService, downloadExamService, uploadExamFileService, deleteExamFileService) {
        this.createEmployeeExamHistoryService = createEmployeeExamHistoryService;
        this.updateEmployeeExamHistoryService = updateEmployeeExamHistoryService;
        this.findEmployeeExamHistoryService = findEmployeeExamHistoryService;
        this.findAskEmployeeExamHistoryService = findAskEmployeeExamHistoryService;
        this.findClinicScheduleEmployeeExamHistoryService = findClinicScheduleEmployeeExamHistoryService;
        this.findCompanyScheduleEmployeeExamHistoryService = findCompanyScheduleEmployeeExamHistoryService;
        this.findByIdEmployeeExamHistoryService = findByIdEmployeeExamHistoryService;
        this.deleteEmployeeExamHistoryService = deleteEmployeeExamHistoryService;
        this.updateManyScheduleExamHistoryService = updateManyScheduleExamHistoryService;
        this.downloadExamService = downloadExamService;
        this.uploadExamFileService = uploadExamFileService;
        this.deleteExamFileService = deleteExamFileService;
    }
    find(userPayloadDto, query) {
        return this.findEmployeeExamHistoryService.execute(query, userPayloadDto);
    }
    findSchedule(userPayloadDto, query) {
        return this.findAskEmployeeExamHistoryService.execute(query, userPayloadDto);
    }
    findCompanySchedule(userPayloadDto, query) {
        return this.findCompanyScheduleEmployeeExamHistoryService.execute(query, userPayloadDto);
    }
    findClinicSchedule(userPayloadDto, query) {
        return this.findClinicScheduleEmployeeExamHistoryService.execute(query, userPayloadDto);
    }
    findById(userPayloadDto, id) {
        return this.findByIdEmployeeExamHistoryService.execute(id, userPayloadDto);
    }
    create(upsertAccessGroupDto, userPayloadDto) {
        return this.createEmployeeExamHistoryService.execute(upsertAccessGroupDto, userPayloadDto);
    }
    createSchedule(upsertAccessGroupDto, userPayloadDto) {
        return this.createEmployeeExamHistoryService.execute(upsertAccessGroupDto, userPayloadDto);
    }
    updateSchedule(upsertAccessGroupDto, userPayloadDto) {
        return this.updateManyScheduleExamHistoryService.execute(upsertAccessGroupDto, userPayloadDto);
    }
    update(upsertAccessGroupDto, userPayloadDto, id) {
        return this.updateEmployeeExamHistoryService.execute(Object.assign(Object.assign({}, upsertAccessGroupDto), { id }), userPayloadDto);
    }
    delete(userPayloadDto, id, employeeId) {
        return this.deleteEmployeeExamHistoryService.execute(id, employeeId, userPayloadDto);
    }
    async download(res, userPayloadDto, id) {
        const { fileKey, fileStream } = await this.downloadExamService.execute(id, userPayloadDto);
        res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);
        fileStream.on('error', function (e) {
            res.status(500).send(e);
        });
        fileStream.pipe(res);
    }
    upload(file, createDto, userPayloadDto) {
        createDto.ids = createDto.ids.map((id) => Number(id));
        return this.uploadExamFileService.execute(createDto, userPayloadDto, file);
    }
    deleteFile(userPayloadDto, id) {
        return this.deleteExamFileService.execute(id, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, employee_exam_history_1.FindEmployeeExamHistoryDto]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)('schedule'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, employee_exam_history_1.FindEmployeeExamHistoryDto]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "findSchedule", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)('schedule/company'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, employee_exam_history_1.FindCompanyEmployeeExamHistoryDto]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "findCompanySchedule", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.CLINIC_SCHEDULE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)('schedule/clinic'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/employee.entity").EmployeeEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, employee_exam_history_1.FindClinicEmployeeExamHistoryDto]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "findClinicSchedule", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)('/:id/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "findById", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('/:companyId?'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_exam_history_1.CreateEmployeeExamHistoryDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('/schedule/:companyId?'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_exam_history_1.CreateEmployeeExamHistoryDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "createSchedule", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.CLINIC_SCHEDULE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('/update-many-schedule/:companyId?'),
    openapi.ApiResponse({ status: 201, type: [require("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity] }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_exam_history_1.UpdateManyScheduleExamDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "updateSchedule", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Patch)('/:id/:companyId?'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_exam_history_1.UpdateEmployeeExamHistoryDto, user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Delete)('/:employeeId/:id/:companyId?'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number, Number]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "delete", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY_FILE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)('/:id/download/:companyId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", Promise)
], EmployeeExamHistoryController.prototype, "download", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY_FILE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('upload/:companyId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 100000000 } })),
    openapi.ApiResponse({ status: 201, type: [require("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity] }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, employee_exam_history_1.UpdateFileExamDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "upload", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY_FILE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Delete)('/file/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], EmployeeExamHistoryController.prototype, "deleteFile", null);
EmployeeExamHistoryController = __decorate([
    (0, swagger_1.ApiTags)('employee-history-exam'),
    (0, common_1.Controller)('employee-history/exam'),
    __metadata("design:paramtypes", [create_service_1.CreateEmployeeExamHistoryService,
        update_service_1.UpdateEmployeeExamHistoryService,
        find_service_1.FindEmployeeExamHistoryService,
        find_schedule_service_1.FindScheduleEmployeeExamHistoryService,
        find_clinic_schedules_service_1.FindClinicScheduleEmployeeExamHistoryService,
        find_company_schedules_service_1.FindCompanyScheduleEmployeeExamHistoryService,
        find_by_id_service_1.FindByIdEmployeeExamHistoryService,
        delete_service_1.DeleteEmployeeExamHistoryService,
        update_many_service_1.UpdateManyScheduleExamHistoryService,
        download_exam_service_1.DownloadExamService,
        upload_exam_file_service_1.UploadExamFileService,
        delete_exam_file_service_1.DeleteExamFileService])
], EmployeeExamHistoryController);
exports.EmployeeExamHistoryController = EmployeeExamHistoryController;
//# sourceMappingURL=employee-exam-history.controller.js.map