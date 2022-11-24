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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllRiskDataByEmployeeService = void 0;
const HierarchyRepository_1 = require("../../../../company/repositories/implementations/HierarchyRepository");
const EmployeeRepository_1 = require("../../../../company/repositories/implementations/EmployeeRepository");
const common_1 = require("@nestjs/common");
const clone_1 = __importDefault(require("clone"));
const RiskRepository_1 = require("../../../repositories/implementations/RiskRepository");
const riskData_entity_1 = require("../../../entities/riskData.entity");
let FindAllRiskDataByEmployeeService = class FindAllRiskDataByEmployeeService {
    constructor(riskRepository, employeeRepository, hierarchyRepository) {
        this.riskRepository = riskRepository;
        this.employeeRepository = employeeRepository;
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(employeeId, companyId, options) {
        const { risk } = await this.getRiskData(employeeId, companyId, options);
        return risk;
    }
    async getRiskData(employeeId, companyId, options) {
        var _a, _b, _c, _d, _e, _f;
        const employee = await this.employeeRepository.findFirstNude({
            where: Object.assign({ id: employeeId }, (companyId && { companyId })),
            select: Object.assign({ id: true, companyId: true, hierarchyHistory: {
                    where: { motive: { not: 'DEM' } },
                    orderBy: { startDate: 'desc' },
                    take: 1,
                    select: {
                        startDate: true,
                        subHierarchies: { select: { id: true } },
                        hierarchy: {
                            select: Object.assign(Object.assign({ id: true }, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { parent: {
                                    select: Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { id: true, parent: {
                                            select: Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { id: true, parent: {
                                                    select: Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { id: true, parent: {
                                                            select: Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { id: true, parent: {
                                                                    select: { parent: true, id: true },
                                                                } }),
                                                        } }),
                                                } }),
                                        } }),
                                } }),
                        },
                    },
                } }, (options.fromExam && {
                examsHistory: {
                    where: { exam: { isAttendance: true } },
                    orderBy: { doneDate: 'desc' },
                    take: 1,
                    select: {
                        doneDate: true,
                        subOfficeId: true,
                        hierarchy: {
                            select: Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { id: true, parent: {
                                    select: Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { id: true, parent: {
                                            select: Object.assign(Object.assign({ id: true }, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { parent: {
                                                    select: Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { id: true, parent: {
                                                            select: Object.assign(Object.assign({ id: true }, ((options === null || options === void 0 ? void 0 : options.hierarchyData) && { type: true, name: true })), { parent: {
                                                                    select: { parent: true, id: true },
                                                                } }),
                                                        } }),
                                                } }),
                                        } }),
                                } }),
                        },
                    },
                },
            })),
        });
        const hierarchyHistory = (_a = employee.hierarchyHistory) === null || _a === void 0 ? void 0 : _a[0];
        const examHistory = (_b = employee === null || employee === void 0 ? void 0 : employee.examsHistory) === null || _b === void 0 ? void 0 : _b[0];
        let date = hierarchyHistory.startDate;
        if (hierarchyHistory) {
            employee.hierarchy = hierarchyHistory === null || hierarchyHistory === void 0 ? void 0 : hierarchyHistory.hierarchy;
            employee.subOffices = hierarchyHistory === null || hierarchyHistory === void 0 ? void 0 : hierarchyHistory.subHierarchies;
        }
        if (examHistory && (examHistory === null || examHistory === void 0 ? void 0 : examHistory.hierarchy) && (examHistory.doneDate > (hierarchyHistory === null || hierarchyHistory === void 0 ? void 0 : hierarchyHistory.startDate) || !(hierarchyHistory === null || hierarchyHistory === void 0 ? void 0 : hierarchyHistory.startDate))) {
            date = examHistory.doneDate;
            employee.hierarchy = examHistory === null || examHistory === void 0 ? void 0 : examHistory.hierarchy;
            employee.subOffices = [{ id: examHistory === null || examHistory === void 0 ? void 0 : examHistory.subOfficeId }];
        }
        const hierarchyIds = [];
        if (employee === null || employee === void 0 ? void 0 : employee.hierarchy) {
            if ((_c = employee.hierarchy) === null || _c === void 0 ? void 0 : _c.id)
                hierarchyIds.push(employee.hierarchy.id);
            if ((_e = (_d = employee.hierarchy) === null || _d === void 0 ? void 0 : _d.parents) === null || _e === void 0 ? void 0 : _e.length)
                hierarchyIds.push(...employee.hierarchy.parents.map((h) => h.id));
        }
        if ((_f = employee === null || employee === void 0 ? void 0 : employee.subOffices) === null || _f === void 0 ? void 0 : _f.length)
            hierarchyIds.push(...employee.subOffices.map((i) => i.id));
        if (!options.filterDate)
            date = undefined;
        const risks = await this.riskRepository.findRiskDataByHierarchies(hierarchyIds, employee.companyId, { date });
        const riskDataReturn = [];
        risks.forEach((risk) => {
            risk.riskFactorData.forEach((riskData) => {
                const riskCopy = (0, clone_1.default)(risk);
                riskCopy.riskFactorData = undefined;
                riskData.riskFactor = riskCopy;
                riskDataReturn.push(riskData);
            });
        });
        return { risk: riskDataReturn.map((riskData) => new riskData_entity_1.RiskFactorDataEntity(riskData)), employee };
    }
};
FindAllRiskDataByEmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskRepository_1.RiskRepository,
        EmployeeRepository_1.EmployeeRepository,
        HierarchyRepository_1.HierarchyRepository])
], FindAllRiskDataByEmployeeService);
exports.FindAllRiskDataByEmployeeService = FindAllRiskDataByEmployeeService;
//# sourceMappingURL=find-by-employee.service.js.map