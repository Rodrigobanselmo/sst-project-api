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
exports.ExamController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const exam_dto_1 = require("../../dto/exam.dto");
const create_exam_service_1 = require("../../services/exam/create-exam/create-exam.service");
const delete_soft_exam_service_1 = require("../../services/exam/delete-soft-exam/delete-soft-exam.service");
const update_exam_service_1 = require("../../services/exam/update-exam/update-exam.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const find_exam_service_1 = require("../../services/exam/find-exam/find-exam.service");
const find_exam_by_hierarchy_service_1 = require("../../services/exam/find-by-hierarchy /find-exam-by-hierarchy.service");
let ExamController = class ExamController {
    constructor(createExamService, findExamService, updateExamService, deleteSoftExamService, findExamByHierarchyService) {
        this.createExamService = createExamService;
        this.findExamService = findExamService;
        this.updateExamService = updateExamService;
        this.deleteSoftExamService = deleteSoftExamService;
        this.findExamByHierarchyService = findExamByHierarchyService;
    }
    create(userPayloadDto, createExamDto) {
        return this.createExamService.execute(createExamDto, userPayloadDto);
    }
    findAllAvailable(userPayloadDto, query) {
        return this.findExamService.execute(query, userPayloadDto);
    }
    findByHierarchy(userPayloadDto, query) {
        return this.findExamByHierarchyService.execute(userPayloadDto, Object.assign({}, query));
    }
    async update(id, userPayloadDto, updateRiskDto) {
        return this.updateExamService.execute(id, updateRiskDto, userPayloadDto);
    }
    async deleteSoft(id, userPayloadDto) {
        return this.deleteSoftExamService.execute(id, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EXAM,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/exam.entity").ExamEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EXAM,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, exam_dto_1.FindExamDto]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findAllAvailable", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EXAM,
        crud: true,
        isMember: true,
        isContract: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('/hierarchy/:companyId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, exam_dto_1.FindExamHierarchyDto]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findByHierarchy", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EXAM,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Patch)('/:id/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/exam.entity").ExamEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_payload_dto_1.UserPayloadDto, exam_dto_1.UpdateExamDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EXAM,
        crud: true,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Delete)('/:id/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/exam.entity").ExamEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "deleteSoft", null);
ExamController = __decorate([
    (0, common_1.Controller)('exam'),
    __metadata("design:paramtypes", [create_exam_service_1.CreateExamService,
        find_exam_service_1.FindExamService,
        update_exam_service_1.UpdateExamService,
        delete_soft_exam_service_1.DeleteSoftExamService,
        find_exam_by_hierarchy_service_1.FindExamByHierarchyService])
], ExamController);
exports.ExamController = ExamController;
//# sourceMappingURL=exam.controller.js.map