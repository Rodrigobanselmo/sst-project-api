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
exports.AuthGroupRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const access_groups_entity_1 = require("../../entities/access-groups.entity");
let AuthGroupRepository = class AuthGroupRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a, system) {
        var { id, companyId } = _a, data = __rest(_a, ["id", "companyId"]);
        const accessGroup = await this.prisma.accessGroups.upsert({
            update: Object.assign(Object.assign({}, data), { system }),
            create: Object.assign(Object.assign({}, data), { system, companyId }),
            where: { id_companyId: { id: id || 0, companyId } },
        });
        return new access_groups_entity_1.AccessGroupsEntity(accessGroup);
    }
    async findById(id, companyId, options = {}) {
        const accessGroup = await this.prisma.accessGroups.findFirst(Object.assign({ where: {
                OR: [
                    { companyId, id },
                    { system: true, id },
                ],
            } }, options));
        return new access_groups_entity_1.AccessGroupsEntity(accessGroup);
    }
    async findAvailable(companyId, query, pagination, options = {}) {
        const where = {
            AND: [{ OR: [{ companyId }, { system: true }] }],
        };
        if ('search' in query) {
            where.AND.push({
                OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
            });
            delete query.search;
        }
        Object.entries(query).forEach(([key, value]) => {
            if (value)
                where.AND.push({
                    [key]: {
                        contains: value,
                        mode: 'insensitive',
                    },
                });
        });
        const response = await this.prisma.$transaction([
            this.prisma.accessGroups.count({
                where,
            }),
            this.prisma.accessGroups.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0, orderBy: { name: 'asc' } })),
        ]);
        return {
            data: response[1].map((group) => new access_groups_entity_1.AccessGroupsEntity(group)),
            count: response[0],
        };
    }
};
AuthGroupRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthGroupRepository);
exports.AuthGroupRepository = AuthGroupRepository;
//# sourceMappingURL=AuthGroupRepository.js.map