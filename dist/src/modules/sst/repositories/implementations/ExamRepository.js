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
exports.ExamRepository = void 0;
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
const exam_entity_1 = require("../../entities/exam.entity");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let i = 0;
let ExamRepository = class ExamRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var createExamDto = __rest(_a, []);
        const redMed = await this.prisma.exam.create({
            data: Object.assign({}, createExamDto),
        });
        return new exam_entity_1.ExamEntity(redMed);
    }
    async update(_a) {
        var { id, companyId } = _a, createExamDto = __rest(_a, ["id", "companyId"]);
        const Exam = await this.prisma.exam.update({
            data: Object.assign({}, createExamDto),
            where: { id_companyId: { companyId, id: id || 0 } },
        });
        return new exam_entity_1.ExamEntity(Exam);
    }
    async upsertMany(upsertDtoMany) {
        i++;
        console.log('batch' + i);
        const data = await this.prisma.$transaction(upsertDtoMany.map((_a) => {
            var { id } = _a, upsertRiskDto = __rest(_a, ["id"]);
            return this.prisma.exam.upsert({
                create: Object.assign({}, upsertRiskDto),
                update: Object.assign({}, upsertRiskDto),
                where: { id },
            });
        }));
        return data.map((exam) => new exam_entity_1.ExamEntity(exam));
    }
    async find(query, pagination, options = {}) {
        const whereInit = Object.assign({ AND: [] }, options.where);
        const include = Object.assign({}, options === null || options === void 0 ? void 0 : options.include);
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search', 'clinicId'],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
            });
        }
        const response = await this.prisma.$transaction([
            this.prisma.exam.count({
                where: { OR: [where, { system: true }] },
            }),
            this.prisma.exam.findMany({
                where: { OR: [where, { system: true }] },
                include: Object.keys(include).length > 0 ? include : undefined,
                take: pagination.take || 20,
                skip: pagination.skip || 0,
                orderBy: { name: 'asc' },
            }),
        ]);
        return {
            data: response[1].map((exam) => new exam_entity_1.ExamEntity(exam)),
            count: response[0],
        };
    }
    async findNude(options = {}) {
        const response = await this.prisma.$transaction([
            this.prisma.exam.count({
                where: options.where,
            }),
            this.prisma.exam.findMany(Object.assign({}, options)),
        ]);
        return {
            data: response[1].map((exam) => new exam_entity_1.ExamEntity(exam)),
            count: response[0],
        };
    }
    async findAll() {
        const exams = await this.prisma.exam.findMany();
        return exams.map((exam) => new exam_entity_1.ExamEntity(exam));
    }
    async DeleteByIdSoft(id) {
        const exams = await this.prisma.exam.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return new exam_entity_1.ExamEntity(exams);
    }
    async DeleteByCompanyAndIdSoft(id, companyId) {
        const exam = await this.prisma.exam.update({
            where: { id_companyId: { id, companyId } },
            data: { deleted_at: new Date() },
        });
        return new exam_entity_1.ExamEntity(exam);
    }
};
ExamRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamRepository);
exports.ExamRepository = ExamRepository;
//# sourceMappingURL=ExamRepository.js.map