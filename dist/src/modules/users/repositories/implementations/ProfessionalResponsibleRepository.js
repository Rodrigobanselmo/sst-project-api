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
exports.ProfessionalResponsibleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
const professional_responsible_entity_1 = require("../../entities/professional-responsible.entity");
let ProfessionalResponsibleRepository = class ProfessionalResponsibleRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCompanyDto) {
        const professionalResponsible = await this.prisma.professionalCouncilResponsible.create({
            data: createCompanyDto,
        });
        return new professional_responsible_entity_1.ProfessionalResponsibleEntity(professionalResponsible);
    }
    async update(_a) {
        var { id } = _a, createCompanyDto = __rest(_a, ["id"]);
        const professionalResponsible = await this.prisma.professionalCouncilResponsible.update({
            data: createCompanyDto,
            where: { id },
        });
        return new professional_responsible_entity_1.ProfessionalResponsibleEntity(professionalResponsible);
    }
    async find(query, pagination, options = {}) {
        const whereInit = {
            AND: [],
        };
        options.select = Object.assign({ id: true, startDate: true, type: true, professional: { select: { councilId: true, councilUF: true, councilType: true, professional: { select: { name: true, id: true } } } } }, options.select);
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search'],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [{ professional: { professional: { name: { contains: query.search, mode: 'insensitive' } } } }],
            });
            delete query.search;
        }
        const response = await this.prisma.$transaction([
            this.prisma.professionalCouncilResponsible.count({
                where,
            }),
            this.prisma.professionalCouncilResponsible.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0, orderBy: { startDate: 'desc' } })),
        ]);
        return {
            data: response[1].map((professionalResponsible) => new professional_responsible_entity_1.ProfessionalResponsibleEntity(professionalResponsible)),
            count: response[0],
        };
    }
    async findNude(options = {}) {
        const professionalResponsible = await this.prisma.professionalCouncilResponsible.findMany(Object.assign({}, options));
        return professionalResponsible.map((professionalResponsible) => new professional_responsible_entity_1.ProfessionalResponsibleEntity(professionalResponsible));
    }
    async findFirstNude(options = {}) {
        const professionalResponsible = await this.prisma.professionalCouncilResponsible.findFirst(Object.assign({}, options));
        return new professional_responsible_entity_1.ProfessionalResponsibleEntity(professionalResponsible);
    }
    async delete(id) {
        const professionalResponsible = await this.prisma.professionalCouncilResponsible.delete({
            where: { id },
        });
        return new professional_responsible_entity_1.ProfessionalResponsibleEntity(professionalResponsible);
    }
};
ProfessionalResponsibleRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfessionalResponsibleRepository);
exports.ProfessionalResponsibleRepository = ProfessionalResponsibleRepository;
//# sourceMappingURL=ProfessionalResponsibleRepository.js.map