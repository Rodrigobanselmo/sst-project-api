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
exports.EpiRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const epi_entity_1 = require("../../entities/epi.entity");
let i = 0;
let EpiRepository = class EpiRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEpiDto) {
        const redMed = await this.prisma.epi.create({
            data: Object.assign({}, createEpiDto),
        });
        return new epi_entity_1.EpiEntity(redMed);
    }
    async update(_a) {
        var { id } = _a, createEpiDto = __rest(_a, ["id"]);
        const Epi = await this.prisma.epi.update({
            data: Object.assign({}, createEpiDto),
            where: { id },
        });
        return new epi_entity_1.EpiEntity(Epi);
    }
    async upsertMany(upsertDtoMany) {
        i++;
        console.log('batch' + i);
        const data = await this.prisma.$transaction(upsertDtoMany.map((_a) => {
            var { id: _, ca } = _a, upsertRiskDto = __rest(_a, ["id", "ca"]);
            return this.prisma.epi.upsert({
                create: Object.assign({ ca }, upsertRiskDto),
                update: Object.assign({}, upsertRiskDto),
                where: { ca_status: { status: 'ACTIVE', ca } },
            });
        }));
        return data.map((epi) => new epi_entity_1.EpiEntity(epi));
    }
    async findByCA(ca) {
        const epi = await this.prisma.epi.findUnique({
            where: { ca_status: { ca, status: 'ACTIVE' } },
        });
        return new epi_entity_1.EpiEntity(epi);
    }
    async find(query, pagination) {
        const where = {};
        Object.entries(query).forEach(([key, value]) => {
            if (value)
                where[key] = {
                    contains: value,
                };
        });
        const response = await this.prisma.$transaction([
            this.prisma.epi.count({
                where,
            }),
            this.prisma.epi.findMany({
                where,
                take: pagination.take || 20,
                skip: pagination.skip || 0,
            }),
        ]);
        const standardEpis = [];
        if (Object.keys(where).length === 0) {
            const epis = await this.prisma.epi.findMany({
                where: { ca: { in: ['0', '1', '2'] } },
            });
            standardEpis.push(...epis);
        }
        const count = response[0];
        return {
            data: [...standardEpis, ...response[1]].map((epi) => new epi_entity_1.EpiEntity(epi)),
            count,
        };
    }
    async findAll() {
        const epis = await this.prisma.epi.findMany();
        return epis.map((epi) => new epi_entity_1.EpiEntity(epi));
    }
    async DeleteByIdSoft(id) {
        const epis = await this.prisma.epi.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return new epi_entity_1.EpiEntity(epis);
    }
};
EpiRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EpiRepository);
exports.EpiRepository = EpiRepository;
//# sourceMappingURL=EpiRepository.js.map