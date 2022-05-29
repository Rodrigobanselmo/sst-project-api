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
exports.EmployeeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const employee_dto_1 = require("../../dto/employee.dto");
const create_employee_service_1 = require("../../services/employee/create-employee/create-employee.service");
const find_all_available_employees_service_1 = require("../../services/employee/find-all-available-employees/find-all-available-employees.service");
const find_employee_service_1 = require("../../services/employee/find-employee/find-employee.service");
let EmployeeController = class EmployeeController {
    constructor(createEmployeeService, findEmployeeService, findAllAvailableEmployeesService) {
        this.createEmployeeService = createEmployeeService;
        this.findEmployeeService = findEmployeeService;
        this.findAllAvailableEmployeesService = findAllAvailableEmployeesService;
    }
    create(createEmployeeDto) {
        return this.createEmployeeService.execute(createEmployeeDto);
    }
    FindAllAvailable(userPayloadDto) {
        return this.findAllAvailableEmployeesService.execute(userPayloadDto);
    }
    findOne(userPayloadDto, employeeId) {
        return this.findEmployeeService.execute(employeeId, userPayloadDto);
    }
};
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/employee.entity").EmployeeEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/employee.entity").EmployeeEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "FindAllAvailable", null);
__decorate([
    (0, common_1.Get)('/:employeeId/:companyId?'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/employee.entity").EmployeeEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "findOne", null);
EmployeeController = __decorate([
    (0, common_1.Controller)('employee'),
    __metadata("design:paramtypes", [create_employee_service_1.CreateEmployeeService,
        find_employee_service_1.FindEmployeeService,
        find_all_available_employees_service_1.FindAllAvailableEmployeesService])
], EmployeeController);
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employee.controller.js.map