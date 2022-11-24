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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeExamsHistoryRepository = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const DayJSProvider_1 = require("../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
const employee_exam_history_entity_1 = require("../../entities/employee-exam-history.entity");
const clone_1 = __importDefault(require("clone"));
let EmployeeExamsHistoryRepository = class EmployeeExamsHistoryRepository {
    constructor(prisma, dayjs) {
        this.prisma = prisma;
        this.dayjs = dayjs;
    }
    async create(_a) {
        var { examsData = [], hierarchyId } = _a, createData = __rest(_a, ["examsData", "hierarchyId"]);
        const data = await this.prisma.employeeExamsHistory.createMany({
            data: [
                ...[
                    createData.examId && Object.assign(Object.assign({}, createData), { hierarchyId, expiredDate: this.dayjs
                            .dayjs(createData.doneDate)
                            .add(createData.validityInMonths || 0, 'months')
                            .toDate() }),
                ].filter((i) => i),
                ...examsData.map((exam) => (Object.assign({ hierarchyId, employeeId: createData.employeeId, userDoneId: createData.userDoneId, userScheduleId: createData.userScheduleId, examType: createData.examType || undefined, expiredDate: this.dayjs
                        .dayjs(exam.doneDate)
                        .add(exam.validityInMonths || 0, 'months')
                        .toDate() }, exam))),
            ],
        });
        return data;
    }
    async update(_a) {
        var { id, examsData, hierarchyId } = _a, updateData = __rest(_a, ["id", "examsData", "hierarchyId"]);
        const data = await this.prisma.employeeExamsHistory.update({
            data: Object.assign(Object.assign({}, updateData), { expiredDate: updateData.validityInMonths && updateData.doneDate
                    ? this.dayjs
                        .dayjs(updateData.doneDate)
                        .add(updateData.validityInMonths || 0, 'months')
                        .toDate()
                    : undefined }),
            where: { id },
        });
        return new employee_exam_history_entity_1.EmployeeExamsHistoryEntity(data);
    }
    async updateMany(updateManyDto) {
        const data = await this.prisma.$transaction(updateManyDto.data.map((_a) => {
            var { id, examsData, hierarchyId } = _a, updateData = __rest(_a, ["id", "examsData", "hierarchyId"]);
            return this.prisma.employeeExamsHistory.update({
                data: Object.assign(Object.assign({}, updateData), { expiredDate: updateData.validityInMonths && updateData.doneDate
                        ? this.dayjs
                            .dayjs(updateData.doneDate)
                            .add(updateData.validityInMonths || 0, 'months')
                            .toDate()
                        : undefined }),
                where: { id },
            });
        }));
        return data.map((data) => new employee_exam_history_entity_1.EmployeeExamsHistoryEntity(data));
    }
    async updateManyNude(options) {
        await this.prisma.employeeExamsHistory.updateMany(options);
    }
    async updateByIds(options) {
        await this.prisma.employeeExamsHistory.updateMany(Object.assign({}, options));
    }
    async find(query, pagination, _a = {}) {
        var _b;
        var { where: whereOptions } = _a, options = __rest(_a, ["where"]);
        const whereOptionsCopy = (0, clone_1.default)(whereOptions);
        const whereInit = Object.assign(Object.assign({}, whereOptions), { AND: [
                Object.assign(Object.assign({ employee: {
                        companyId: query.companyId,
                    } }, (!query.allCompanies && {
                    employee: {
                        companyId: query.companyId,
                    },
                })), (query.allCompanies && {
                    OR: [
                        {
                            employee: {
                                companyId: query.companyId,
                            },
                        },
                        {
                            employee: {
                                company: {
                                    receivingServiceContracts: {
                                        some: { applyingServiceCompanyId: query.companyId },
                                    },
                                },
                            },
                        },
                    ],
                })),
                ...(whereOptionsCopy && ((_b = whereOptionsCopy) === null || _b === void 0 ? void 0 : _b.AND) ? whereOptionsCopy.AND : []),
            ] });
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search', 'companyId', 'allCompanies', 'userCompany'],
        });
        if ('search' in query) {
            const OR = [];
            const CPF = (0, brazilian_utils_1.onlyNumbers)(query.search);
            const isCPF = CPF.length == 11;
            if (!isCPF) {
                OR.push({ name: { contains: query.search, mode: 'insensitive' } });
                OR.push({ email: { contains: query.search, mode: 'insensitive' } });
                OR.push({
                    esocialCode: { contains: query.search, mode: 'insensitive' },
                });
            }
            else {
                OR.push({
                    cpf: CPF,
                });
            }
            where.AND.push({ employee: { OR } });
            delete query.search;
        }
        const response = await this.prisma.$transaction([
            (options === null || options === void 0 ? void 0 : options.distinct)
                ? this.prisma.employeeExamsHistory.findMany(Object.assign(Object.assign({ where }, ((options === null || options === void 0 ? void 0 : options.distinct) && { distinct: options.distinct })), { select: { id: true }, take: 1000 }))
                : this.prisma.employeeExamsHistory.count({ where }),
            this.prisma.employeeExamsHistory.findMany(Object.assign({ where, take: pagination.take || 20, skip: pagination.skip || 0, orderBy: [{ doneDate: 'desc' }, { exam: { isAttendance: 'desc' } }] }, options)),
        ]);
        return {
            data: response[1].map((data) => new employee_exam_history_entity_1.EmployeeExamsHistoryEntity(data)),
            count: Array.isArray(response[0]) ? response[0].length : response[0],
        };
    }
    async findNude(options = {}) {
        const data = await this.prisma.employeeExamsHistory.findMany(Object.assign({}, options));
        return data.map((data) => new employee_exam_history_entity_1.EmployeeExamsHistoryEntity(data));
    }
    async countNude(options = {}) {
        const data = await this.prisma.employeeExamsHistory.count(Object.assign({}, options));
        return data;
    }
    async findFirstNude(options = {}) {
        const data = await this.prisma.employeeExamsHistory.findFirst(Object.assign({}, options));
        return new employee_exam_history_entity_1.EmployeeExamsHistoryEntity(data);
    }
    async findUniqueNude(options) {
        const data = await this.prisma.employeeExamsHistory.findUnique(Object.assign({}, options));
        return new employee_exam_history_entity_1.EmployeeExamsHistoryEntity(data);
    }
    async delete(id) {
        const data = await this.prisma.employeeExamsHistory.delete({
            where: { id },
        });
        return new employee_exam_history_entity_1.EmployeeExamsHistoryEntity(data);
    }
};
EmployeeExamsHistoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, DayJSProvider_1.DayJSProvider])
], EmployeeExamsHistoryRepository);
exports.EmployeeExamsHistoryRepository = EmployeeExamsHistoryRepository;
//# sourceMappingURL=EmployeeExamsHistoryRepository.js.map