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
exports.FindEmployeeService = void 0;
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const EmployeeRepository_1 = require("../../../../../modules/company/repositories/implementations/EmployeeRepository");
let FindEmployeeService = class FindEmployeeService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    async execute(id, user) {
        const employee = await this.employeeRepository.findById(id, user.targetCompanyId);
        if (!(employee === null || employee === void 0 ? void 0 : employee.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.EMPLOYEE_NOT_FOUND);
        return employee;
    }
};
FindEmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeRepository_1.EmployeeRepository])
], FindEmployeeService);
exports.FindEmployeeService = FindEmployeeService;
//# sourceMappingURL=find-employee.service.js.map