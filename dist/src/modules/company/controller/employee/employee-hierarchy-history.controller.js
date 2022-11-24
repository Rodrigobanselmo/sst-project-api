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
exports.EmployeeHierarchyHistoryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const employee_hierarchy_history_1 = require("../../dto/employee-hierarchy-history");
const create_service_1 = require("../../services/employee/0-history/hierarchy/create/create.service");
const delete_service_1 = require("../../services/employee/0-history/hierarchy/delete/delete.service");
const find_service_1 = require("../../services/employee/0-history/hierarchy/find/find.service");
const update_service_1 = require("../../services/employee/0-history/hierarchy/update/update.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
let EmployeeHierarchyHistoryController = class EmployeeHierarchyHistoryController {
    constructor(createEmployeeHierarchyHistoryService, updateEmployeeHierarchyHistoryService, findEmployeeHierarchyHistoryService, deleteEmployeeHierarchyHistoryService) {
        this.createEmployeeHierarchyHistoryService = createEmployeeHierarchyHistoryService;
        this.updateEmployeeHierarchyHistoryService = updateEmployeeHierarchyHistoryService;
        this.findEmployeeHierarchyHistoryService = findEmployeeHierarchyHistoryService;
        this.deleteEmployeeHierarchyHistoryService = deleteEmployeeHierarchyHistoryService;
    }
    find(userPayloadDto, query) {
        return this.findEmployeeHierarchyHistoryService.execute(query, userPayloadDto);
    }
    create(upsertAccessGroupDto, userPayloadDto) {
        return this.createEmployeeHierarchyHistoryService.execute(upsertAccessGroupDto, userPayloadDto);
    }
    update(upsertAccessGroupDto, userPayloadDto, id) {
        return this.updateEmployeeHierarchyHistoryService.execute(Object.assign(Object.assign({}, upsertAccessGroupDto), { id }), userPayloadDto);
    }
    delete(userPayloadDto, id, employeeId) {
        return this.deleteEmployeeHierarchyHistoryService.execute(id, employeeId, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, employee_hierarchy_history_1.FindEmployeeHierarchyHistoryDto]),
    __metadata("design:returntype", void 0)
], EmployeeHierarchyHistoryController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('/:companyId?'),
    openapi.ApiResponse({ status: 201, type: require("../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_hierarchy_history_1.CreateEmployeeHierarchyHistoryDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], EmployeeHierarchyHistoryController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Patch)('/:id/:companyId?'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_hierarchy_history_1.UpdateEmployeeHierarchyHistoryDto, user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], EmployeeHierarchyHistoryController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Delete)('/:employeeId/:id/:companyId?'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/employee-hierarchy-history.entity").EmployeeHierarchyHistoryEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number, Number]),
    __metadata("design:returntype", void 0)
], EmployeeHierarchyHistoryController.prototype, "delete", null);
EmployeeHierarchyHistoryController = __decorate([
    (0, swagger_1.ApiTags)('employee-history-hierarchy'),
    (0, common_1.Controller)('employee-history/hierarchy'),
    __metadata("design:paramtypes", [create_service_1.CreateEmployeeHierarchyHistoryService,
        update_service_1.UpdateEmployeeHierarchyHistoryService,
        find_service_1.FindEmployeeHierarchyHistoryService,
        delete_service_1.DeleteEmployeeHierarchyHistoryService])
], EmployeeHierarchyHistoryController);
exports.EmployeeHierarchyHistoryController = EmployeeHierarchyHistoryController;
//# sourceMappingURL=employee-hierarchy-history.controller.js.map