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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamToClinicRepository = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const examToClinic_1 = require("../../entities/examToClinic");
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
let ExamToClinicRepository = class ExamToClinicRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var createExamToClinicDto = __rest(_a, []);
        const examEntity = await this.prisma.examToClinic.create({
            data: Object.assign({}, createExamToClinicDto),
        });
        return new examToClinic_1.ExamToClinicEntity(examEntity);
    }
    async update(_a) {
        var { id } = _a, createExamToClinicDto = __rest(_a, ["id"]);
        const ExamToClinic = await this.prisma.examToClinic.update({
            data: Object.assign({}, createExamToClinicDto),
            where: { id },
        });
        return new examToClinic_1.ExamToClinicEntity(ExamToClinic);
    }
    async upsert(_a) {
        var { examId, companyId, startDate, groupId } = _a, createExamToClinicDto = __rest(_a, ["examId", "companyId", "startDate", "groupId"]);
        const GROUP_ID = groupId || (0, uuid_1.v4)();
        const examEntity = await this.prisma.examToClinic.upsert({
            create: Object.assign({ examId,
                companyId,
                startDate, groupId: GROUP_ID }, createExamToClinicDto),
            update: Object.assign({}, createExamToClinicDto),
            where: {
                examId_companyId_startDate_groupId: {
                    examId,
                    companyId,
                    startDate,
                    groupId: GROUP_ID,
                },
            },
        });
        return new examToClinic_1.ExamToClinicEntity(examEntity);
    }
    async createMany({ companyId, data }) {
        await this.prisma.examToClinic.createMany({
            data: data.map((_a) => {
                var { id, endDate, groupId } = _a, examRisk = __rest(_a, ["id", "endDate", "groupId"]);
                return (Object.assign(Object.assign({}, examRisk), { companyId }));
            }),
        });
    }
    async findNude(options) {
        const data = await this.prisma.examToClinic.findMany(Object.assign({}, options));
        return data.map((exam) => new examToClinic_1.ExamToClinicEntity(exam));
    }
    async find(query, pagination, options = {}) {
        var _a;
        const whereInit = {
            AND: [],
        };
        let orderBy = { exam: { name: 'asc' } };
        if ('orderBy' in query)
            orderBy = { [query.orderBy]: (_a = query === null || query === void 0 ? void 0 : query.orderByDirection) !== null && _a !== void 0 ? _a : 'asc' };
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search'],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [{ exam: { name: { contains: query.search, mode: 'insensitive' } } }],
            });
        }
        const response = await this.prisma.$transaction([
            this.prisma.examToClinic.count({
                where,
            }),
            this.prisma.examToClinic.findMany({
                where,
                include: Object.assign({ exam: true }, options === null || options === void 0 ? void 0 : options.include),
                take: pagination.take || 20,
                skip: pagination.skip || 0,
                orderBy,
            }),
        ]);
        return {
            data: response[1].map((exam) => new examToClinic_1.ExamToClinicEntity(exam)),
            count: response[0],
        };
    }
};
ExamToClinicRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamToClinicRepository);
exports.ExamToClinicRepository = ExamToClinicRepository;
//# sourceMappingURL=ExamToClinicRepository.js.map