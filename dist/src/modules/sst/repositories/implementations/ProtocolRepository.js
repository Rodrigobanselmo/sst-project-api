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
exports.ProtocolRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
const protocol_entity_1 = require("../../entities/protocol.entity");
let ProtocolRepository = class ProtocolRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCompanyDto) {
        const protocol = await this.prisma.protocol.create({
            data: createCompanyDto,
        });
        return new protocol_entity_1.ProtocolEntity(protocol);
    }
    async update(_a) {
        var { id, companyId } = _a, createCompanyDto = __rest(_a, ["id", "companyId"]);
        const protocol = await this.prisma.protocol.update({
            data: Object.assign({}, createCompanyDto),
            where: { id_companyId: { companyId, id } },
        });
        return new protocol_entity_1.ProtocolEntity(protocol);
    }
    async updateProtocolRiskREMOVE({ companyId, protocolIds, riskIds }) {
        const createArray = protocolIds
            .map((protocolId) => {
            return riskIds.map((riskId) => this.prisma.protocolToRisk.upsert({
                where: { riskId_protocolId: { protocolId, riskId } },
                create: {
                    protocolId,
                    riskId,
                    companyId,
                },
                update: {},
            }));
        })
            .reduce((acc, curr) => {
            return [...acc, ...curr];
        }, []);
        const data = await this.prisma.$transaction([
            this.prisma.protocolToRisk.deleteMany({
                where: { protocolId: { in: protocolIds }, riskId: { in: riskIds } },
            }),
            ...createArray,
        ]);
        return data.map((dt) => 'id' in dt && new protocol_entity_1.ProtocolEntity(dt));
    }
    async find(query, pagination, options = {}) {
        const whereInit = {
            AND: [],
        };
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search'],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
            });
            delete query.search;
        }
        const response = await this.prisma.$transaction([
            this.prisma.protocol.count({
                where,
            }),
            this.prisma.protocol.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0, orderBy: { name: 'asc' } })),
        ]);
        return {
            data: response[1].map((protocol) => new protocol_entity_1.ProtocolEntity(protocol)),
            count: response[0],
        };
    }
    async findNude(options = {}) {
        const protocols = await this.prisma.protocol.findMany(Object.assign({}, options));
        return protocols.map((protocol) => new protocol_entity_1.ProtocolEntity(protocol));
    }
    async findFirstNude(options = {}) {
        const protocol = await this.prisma.protocol.findFirst(Object.assign({}, options));
        return new protocol_entity_1.ProtocolEntity(protocol);
    }
    async deleteSoft(id) {
        const protocol = await this.prisma.protocol.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return new protocol_entity_1.ProtocolEntity(protocol);
    }
};
ProtocolRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProtocolRepository);
exports.ProtocolRepository = ProtocolRepository;
//# sourceMappingURL=ProtocolRepository.js.map