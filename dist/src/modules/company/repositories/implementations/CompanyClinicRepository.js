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
exports.CompanyClinicRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
const company_clinics_entity_1 = require("../../entities/company-clinics.entity");
let CompanyClinicRepository = class CompanyClinicRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async set(createCompanyDto, companyId) {
        await this.prisma.$transaction([
            this.prisma.companyClinics.deleteMany({ where: { companyId } }),
            this.prisma.companyClinics.createMany({
                data: createCompanyDto.ids.map(({ clinicId, companyId }) => ({
                    clinicId,
                    companyId,
                })),
            }),
        ]);
    }
    async findAllByCompany(query, pagination, options = {}) {
        const whereInit = {
            AND: [],
        };
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search'],
        });
        if ('search' in query) {
            delete query.search;
        }
        const response = await this.prisma.$transaction([
            this.prisma.companyClinics.count({
                where,
            }),
            this.prisma.companyClinics.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0 })),
        ]);
        return {
            data: response[1].map((companyClinic) => new company_clinics_entity_1.CompanyClinicsEntity(companyClinic)),
            count: response[0],
        };
    }
    async findNude(options = {}) {
        const companyClinics = await this.prisma.companyClinics.findMany(Object.assign({}, options));
        return companyClinics.map((companyClinic) => new company_clinics_entity_1.CompanyClinicsEntity(companyClinic));
    }
    async findFirstNude(options = {}) {
        const companyClinic = await this.prisma.companyClinics.findFirst(Object.assign({}, options));
        return new company_clinics_entity_1.CompanyClinicsEntity(companyClinic);
    }
    async delete(clinicId, companyId) {
        const companyClinic = await this.prisma.companyClinics.delete({
            where: { companyId_clinicId: { companyId, clinicId } },
        });
        return new company_clinics_entity_1.CompanyClinicsEntity(companyClinic);
    }
};
CompanyClinicRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyClinicRepository);
exports.CompanyClinicRepository = CompanyClinicRepository;
//# sourceMappingURL=CompanyClinicRepository.js.map