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
exports.ActivityRepository = void 0;
const prisma_filters_1 = require("./../../../../shared/utils/filters/prisma.filters");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const activity_entity_1 = require("../../entities/activity.entity");
let i = 0;
let ActivityRepository = class ActivityRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const activities = await this.prisma.activity.findMany();
        if (!activities)
            return;
        return activities.map((activity) => new activity_entity_1.ActivityEntity(activity));
    }
    async upsertMany(activitiesDto) {
        i++;
        console.log('batch' + i);
        const data = await this.prisma.$transaction(activitiesDto.map((_a) => {
            var { code } = _a, activityDto = __rest(_a, ["code"]);
            return this.prisma.activity.upsert({
                where: { code },
                create: Object.assign(Object.assign({}, activityDto), { code }),
                update: activityDto,
            });
        }));
        return data.map((activity) => new activity_entity_1.ActivityEntity(activity));
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
                OR: [{ name: { contains: query.search, mode: 'insensitive' } }, { code: { contains: query.search } }],
            });
        }
        const response = await this.prisma.$transaction([
            this.prisma.activity.count({
                where,
            }),
            this.prisma.activity.findMany(Object.assign(Object.assign({}, options), { where, take: pagination.take || 20, skip: pagination.skip || 0, orderBy: { name: 'asc' } })),
        ]);
        return {
            data: response[1].map((contact) => new activity_entity_1.ActivityEntity(contact)),
            count: response[0],
        };
    }
};
ActivityRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivityRepository);
exports.ActivityRepository = ActivityRepository;
//# sourceMappingURL=ActivityRepository.js.map