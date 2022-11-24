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
exports.ProtocolToRiskRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
const protocol_entity_1 = require("../../entities/protocol.entity");
let ProtocolToRiskRepository = class ProtocolToRiskRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var createProtocolToRiskDto = __rest(_a, []);
        const redMed = await this.prisma.protocolToRisk.create({
            data: Object.assign({}, createProtocolToRiskDto),
        });
        return new protocol_entity_1.ProtocolToRiskEntity(redMed);
    }
    async update(_a) {
        var { id, companyId } = _a, createProtocolToRiskDto = __rest(_a, ["id", "companyId"]);
        const Exam = await this.prisma.protocolToRisk.update({
            data: Object.assign({}, createProtocolToRiskDto),
            where: { id_companyId: { companyId, id: id || 0 } },
        });
        return new protocol_entity_1.ProtocolToRiskEntity(Exam);
    }
    async find(query, pagination, options = {}) {
        const whereInit = {
            AND: [],
        };
        const include = Object.assign({}, options === null || options === void 0 ? void 0 : options.include);
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search'],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [{ protocol: { name: { contains: query.search, mode: 'insensitive' } } }, { risk: { name: { contains: query.search, mode: 'insensitive' } } }],
            });
        }
        const response = await this.prisma.$transaction([
            this.prisma.protocolToRisk.count({
                where,
            }),
            this.prisma.protocolToRisk.findMany({
                where,
                include: Object.keys(include).length > 0 ? include : undefined,
                take: pagination.take || 20,
                skip: pagination.skip || 0,
                orderBy: { risk: { name: 'asc' } },
            }),
        ]);
        return {
            data: response[1].map((exam) => new protocol_entity_1.ProtocolToRiskEntity(exam)),
            count: response[0],
        };
    }
    async createMany({ companyId, data }) {
        await this.prisma.protocolToRisk.createMany({
            data: data.map((_a) => {
                var { id } = _a, examRisk = __rest(_a, ["id"]);
                return (Object.assign(Object.assign({}, examRisk), { companyId }));
            }),
        });
    }
    async upsertMany({ companyId, data }) {
        const dataUpsert = await this.prisma.$transaction(data.map((_a) => {
            var { id } = _a, examRisk = __rest(_a, ["id"]);
            return this.prisma.protocolToRisk.upsert({
                create: Object.assign(Object.assign({}, examRisk), { companyId }),
                update: Object.assign({}, examRisk),
                where: { id },
            });
        }));
        return dataUpsert.map((risk) => new protocol_entity_1.ProtocolToRiskEntity(risk));
    }
    async findNude(options = {}) {
        const exams = await this.prisma.protocolToRisk.findMany(options);
        return exams.map((exam) => new protocol_entity_1.ProtocolToRiskEntity(exam));
    }
};
ProtocolToRiskRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProtocolToRiskRepository);
exports.ProtocolToRiskRepository = ProtocolToRiskRepository;
//# sourceMappingURL=ProtocolRiskRepository.js.map