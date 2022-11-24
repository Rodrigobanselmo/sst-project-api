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
exports.ESocialEventRepository = void 0;
const prisma_filters_1 = require("./../../../../shared/utils/filters/prisma.filters");
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const employeeEsocialEvent_entity_1 = require("../../entities/employeeEsocialEvent.entity");
let ESocialEventRepository = class ESocialEventRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async find(query, pagination, options = {}) {
        const companyId = query.companyId;
        const whereInit = Object.assign({ AND: [
                ...(companyId
                    ? [
                        {
                            company: Object.assign({ OR: [
                                    { id: companyId },
                                    {
                                        receivingServiceContracts: {
                                            some: { applyingServiceCompanyId: companyId },
                                        },
                                    },
                                ] }, options === null || options === void 0 ? void 0 : options.where),
                        },
                    ]
                    : []),
            ] }, options.where);
        options.orderBy = {
            created_at: 'desc',
        };
        options.select = Object.assign({ id: true, created_at: true, updated_at: true, type: true, employee: { select: { name: true, id: true, cpf: true } }, eventXml: true, response: true, employeeId: true, action: true, receipt: true, batchId: true, batch: { select: { environment: true } }, company: {
                select: {
                    id: true,
                    name: true,
                    group: { select: { id: true, name: true } },
                    cnpj: true,
                    fantasy: true,
                    initials: true,
                },
            }, companyId: true, status: true }, options === null || options === void 0 ? void 0 : options.select);
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['search', 'companyId'],
        });
        if ('search' in query) {
            where.AND.push({
                OR: [
                    {
                        employee: {
                            cpf: {
                                contains: query.search ? (0, brazilian_utils_1.onlyNumbers)(query.search) || 'no' : '',
                            },
                        },
                    },
                    {
                        company: {
                            OR: [
                                {
                                    group: {
                                        name: { contains: query.search, mode: 'insensitive' },
                                    },
                                },
                                { name: { contains: query.search, mode: 'insensitive' } },
                                { fantasy: { contains: query.search, mode: 'insensitive' } },
                                { initials: { contains: query.search, mode: 'insensitive' } },
                                {
                                    cnpj: {
                                        contains: query.search ? (0, brazilian_utils_1.onlyNumbers)(query.search) || 'no' : '',
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
            delete query.search;
        }
        const response = await this.prisma.$transaction([
            this.prisma.employeeESocialEvent.count({
                where,
            }),
            this.prisma.employeeESocialEvent.findMany(Object.assign(Object.assign({ take: pagination.take || 20, skip: pagination.skip || 0 }, options), { where })),
        ]);
        return {
            data: response[1].map((employee) => new employeeEsocialEvent_entity_1.EmployeeESocialEventEntity(employee)),
            count: response[0],
        };
    }
    async updateNude(options) {
        const employee = await this.prisma.employeeESocialEvent.update(options);
        return new employeeEsocialEvent_entity_1.EmployeeESocialEventEntity(employee);
    }
    async findFirstNude(options) {
        const employee = await this.prisma.employeeESocialEvent.findFirst(options);
        return new employeeEsocialEvent_entity_1.EmployeeESocialEventEntity(employee);
    }
    async updateManyNude(options) {
        await this.prisma.employeeESocialEvent.updateMany(options);
    }
};
ESocialEventRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ESocialEventRepository);
exports.ESocialEventRepository = ESocialEventRepository;
//# sourceMappingURL=ESocialEventRepository.js.map