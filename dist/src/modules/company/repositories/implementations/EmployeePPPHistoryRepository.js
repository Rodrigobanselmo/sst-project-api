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
exports.EmployeePPPHistoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const employee_ppp_history_entity_1 = require("../../entities/employee-ppp-history.entity");
const i = 0;
let EmployeePPPHistoryRepository = class EmployeePPPHistoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createManyNude(createData, options) {
        const data = await this.prisma.$transaction(createData.map((data) => this.prisma.employeePPPHistory.create({
            data,
            select: { id: true },
        })));
        return data.map((data) => new employee_ppp_history_entity_1.EmployeePPPHistoryEntity(data));
    }
    async upsertManyNude(createData, options) {
        const data = await this.prisma.$transaction(createData.map((data) => this.prisma.employeePPPHistory.upsert(Object.assign(Object.assign({}, data), options))));
        return data.map((data) => new employee_ppp_history_entity_1.EmployeePPPHistoryEntity(data));
    }
    async findNude(options = {}) {
        const data = await this.prisma.employeePPPHistory.findMany(Object.assign({}, options));
        return data.map((data) => new employee_ppp_history_entity_1.EmployeePPPHistoryEntity(data));
    }
    async updateManyNude(options) {
        const data = await this.prisma.employeePPPHistory.updateMany(Object.assign({}, options));
        return data;
    }
    async findFirstNude(options = {}) {
        const data = await this.prisma.employeePPPHistory.findFirst(Object.assign({}, options));
        return new employee_ppp_history_entity_1.EmployeePPPHistoryEntity(data);
    }
};
EmployeePPPHistoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeePPPHistoryRepository);
exports.EmployeePPPHistoryRepository = EmployeePPPHistoryRepository;
//# sourceMappingURL=EmployeePPPHistoryRepository.js.map