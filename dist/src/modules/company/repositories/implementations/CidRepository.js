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
exports.CidRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
const cid_entity_1 = require("../../entities/cid.entity");
let i = 0;
let CidRepository = class CidRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertMany(cidsDto) {
        i++;
        console.log('batch' + i);
        const data = await this.prisma.$transaction(cidsDto.map((_a) => {
            var { cid } = _a, rest = __rest(_a, ["cid"]);
            return this.prisma.cid.upsert({
                where: { cid },
                create: Object.assign(Object.assign({}, rest), { cid }),
                update: rest,
            });
        }));
        return data.map((cid) => new cid_entity_1.CidEntity(cid));
    }
    async find(query, pagination, options = {}) {
        const whereInit = {
            AND: [],
        };
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: [],
        });
        const response = await this.prisma.$transaction([
            this.prisma.cid.count({
                where,
            }),
            this.prisma.cid.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0, orderBy: { cid: 'asc' } })),
        ]);
        return {
            data: response[1].map((data) => new cid_entity_1.CidEntity(data)),
            count: response[0],
        };
    }
    async findNude(options = {}) {
        const data = await this.prisma.cid.findMany(Object.assign({}, options));
        return data.map((data) => new cid_entity_1.CidEntity(data));
    }
    async findFirstNude(options = {}) {
        const data = await this.prisma.cid.findFirst(Object.assign({}, options));
        return new cid_entity_1.CidEntity(data);
    }
};
CidRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CidRepository);
exports.CidRepository = CidRepository;
//# sourceMappingURL=CidRepository.js.map