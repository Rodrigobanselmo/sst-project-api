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
exports.ExamToClinicController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const exam_to_clinic_dto_1 = require("../../dto/exam-to-clinic.dto");
const copy_exam_to_clinic_service_1 = require("../../services/examToClinic/copy-exam-to-clinic/copy-exam-to-clinic.service");
const find_exam_to_clinic_service_1 = require("../../services/examToClinic/find-exam-to-clinic/find-exam-to-clinic.service");
const upsert_exam_to_clinic_service_1 = require("../../services/examToClinic/upsert-exam-to-clinic/upsert-exam-to-clinic.service");
let ExamToClinicController = class ExamToClinicController {
    constructor(upsertExamToClinicService, findExamToClinicService, copyExamToClinicService) {
        this.upsertExamToClinicService = upsertExamToClinicService;
        this.findExamToClinicService = findExamToClinicService;
        this.copyExamToClinicService = copyExamToClinicService;
    }
    create(userPayloadDto, upsertDataDto) {
        return this.upsertExamToClinicService.execute(upsertDataDto, userPayloadDto);
    }
    copy(userPayloadDto, createExamDto) {
        return this.copyExamToClinicService.execute(createExamDto, userPayloadDto);
    }
    findAllAvailable(userPayloadDto, query) {
        return this.findExamToClinicService.execute(query, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EXAM_CLINIC,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/examToClinic").ExamToClinicEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, exam_to_clinic_dto_1.UpsertExamToClinicDto]),
    __metadata("design:returntype", void 0)
], ExamToClinicController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EXAM_CLINIC,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Post)('copy'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, exam_to_clinic_dto_1.CopyExamsToClinicDto]),
    __metadata("design:returntype", void 0)
], ExamToClinicController.prototype, "copy", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EXAM_CLINIC,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, exam_to_clinic_dto_1.FindExamToClinicDto]),
    __metadata("design:returntype", void 0)
], ExamToClinicController.prototype, "findAllAvailable", null);
ExamToClinicController = __decorate([
    (0, common_1.Controller)('/clinic-exam'),
    __metadata("design:paramtypes", [upsert_exam_to_clinic_service_1.UpsertExamToClinicService,
        find_exam_to_clinic_service_1.FindExamToClinicService,
        copy_exam_to_clinic_service_1.CopyExamToClinicService])
], ExamToClinicController);
exports.ExamToClinicController = ExamToClinicController;
//# sourceMappingURL=exam-to-clinic.controller.js.map