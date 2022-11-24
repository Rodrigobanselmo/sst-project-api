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
exports.ESocialBatchRepository = void 0;
const prisma_filters_1 = require("./../../../../shared/utils/filters/prisma.filters");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const employeeEsocialBatch_entity_1 = require("../../entities/employeeEsocialBatch.entity");
const client_1 = require("@prisma/client");
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
let ESocialBatchRepository = class ESocialBatchRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var { companyId, events, environment, status, type, examsIds, pppJson } = _a, rest = __rest(_a, ["companyId", "events", "environment", "status", "type", "examsIds", "pppJson"]);
        const pppTree = {};
        if (pppJson) {
            const pppHistory = await this.prisma.$transaction(pppJson.map((data) => {
                const eventDate = data.event.eventDate;
                return this.prisma.employeePPPHistory.upsert({
                    create: {
                        json: data.json,
                        doneDate: eventDate,
                        employeeId: data.event.employee.id,
                        sendEvent: false,
                        status: status == client_1.StatusEnum.TRANSMITTED ? client_1.StatusEnum.DONE : client_1.StatusEnum.PENDING,
                    },
                    update: { json: data.json, sendEvent: false },
                    where: {
                        employeeId_doneDate: {
                            doneDate: eventDate,
                            employeeId: data.event.employee.id,
                        },
                    },
                    select: { id: true },
                });
            }));
            pppHistory.forEach((pppHistory, index) => {
                const event = pppJson[index].event;
                pppTree[`${event.employee.id}${event.id}`] = pppHistory.id;
            });
        }
        const batch = await this.prisma.employeeESocialBatch.create({
            data: Object.assign(Object.assign({ type,
                companyId,
                status,
                environment }, (events.length > 0 &&
                status != client_1.StatusEnum.ERROR && {
                events: {
                    create: events.map((event) => (Object.assign(Object.assign(Object.assign({ companyId,
                        type }, (pppTree[`${event.employeeId}${event.eventId}`] && {
                        pppId: pppTree[`${event.employeeId}${event.eventId}`],
                    })), { status: status == client_1.StatusEnum.TRANSMITTED ? client_1.StatusEnum.TRANSMITTED : client_1.StatusEnum.PROCESSING }), event))),
                },
            })), rest),
        });
        if (examsIds)
            await this.prisma.employeeExamsHistory.updateMany({
                where: { id: { in: examsIds } },
                data: { sendEvent: false },
            });
        return new employeeEsocialBatch_entity_1.EmployeeESocialBatchEntity(batch);
    }
    async findNude(options = {}) {
        const data = await this.prisma.employeeESocialBatch.findMany(Object.assign({}, options));
        return data.map((data) => new employeeEsocialBatch_entity_1.EmployeeESocialBatchEntity(data));
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
        options.select = Object.assign({ id: true, environment: true, created_at: true, type: true, response: true, userTransmission: { select: { name: true, email: true } }, company: {
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
                company: {
                    OR: [
                        {
                            group: { name: { contains: query.search, mode: 'insensitive' } },
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
            });
            delete query.search;
        }
        const response = await this.prisma.$transaction([
            this.prisma.employeeESocialBatch.count({
                where,
            }),
            this.prisma.employeeESocialBatch.findMany(Object.assign(Object.assign({ take: pagination.take || 20, skip: pagination.skip || 0 }, options), { where })),
        ]);
        return {
            data: response[1].map((employee) => new employeeEsocialBatch_entity_1.EmployeeESocialBatchEntity(employee)),
            count: response[0],
        };
    }
    async updateNude(options) {
        const employee = await this.prisma.employeeESocialBatch.update(options);
        return new employeeEsocialBatch_entity_1.EmployeeESocialBatchEntity(employee);
    }
};
ESocialBatchRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ESocialBatchRepository);
exports.ESocialBatchRepository = ESocialBatchRepository;
//# sourceMappingURL=ESocialBatchRepository.js.map