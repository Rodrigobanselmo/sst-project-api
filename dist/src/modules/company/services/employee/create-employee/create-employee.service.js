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
exports.CreateEmployeeService = void 0;
const common_1 = require("@nestjs/common");
const EmployeeRepository_1 = require("../../../../../modules/company/repositories/implementations/EmployeeRepository");
let CreateEmployeeService = class CreateEmployeeService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    async execute(createEmployeeDto) {
        const company = await this.employeeRepository.create(Object.assign({}, createEmployeeDto));
        return company;
    }
};
CreateEmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeRepository_1.EmployeeRepository])
], CreateEmployeeService);
exports.CreateEmployeeService = CreateEmployeeService;
//# sourceMappingURL=create-employee.service.js.map