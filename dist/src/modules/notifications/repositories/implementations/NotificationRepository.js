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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const prisma_filters_1 = require("../../../../shared/utils/filters/prisma.filters");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const notification_entity_1 = require("../../entities/notification.entity");
const dayjs_1 = __importDefault(require("dayjs"));
let NotificationRepository = class NotificationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var { companiesIds, usersIds, json } = _a, createNotificationDto = __rest(_a, ["companiesIds", "usersIds", "json"]);
        const notification = await this.prisma.notification.create({
            data: Object.assign(Object.assign({}, createNotificationDto), { json: json, companies: companiesIds ? { connect: companiesIds.map((id) => ({ id })) } : undefined, users: usersIds ? { connect: usersIds.map((id) => ({ id })) } : undefined }),
        });
        return new notification_entity_1.NotificationEntity(notification);
    }
    async update(_a) {
        var { id, companiesIds, usersIds, json } = _a, createNotificationDto = __rest(_a, ["id", "companiesIds", "usersIds", "json"]);
        const notification = await this.prisma.notification.update({
            data: Object.assign(Object.assign({}, createNotificationDto), { json: json, companies: companiesIds ? { set: companiesIds.map((id) => ({ id })) } : undefined, users: usersIds ? { set: usersIds.map((id) => ({ id })) } : undefined }),
            where: { id },
        });
        return new notification_entity_1.NotificationEntity(notification);
    }
    async confirm({ userId, id }) {
        const notification = await this.prisma.notification.update({
            data: {
                confirmations: { connect: { id: userId } },
            },
            where: { id },
        });
        return new notification_entity_1.NotificationEntity(notification);
    }
    async confirmMany({ userId, ids }) {
        const data = await this.prisma.$transaction(ids.map((id) => this.prisma.notification.update({
            data: {
                confirmations: { connect: { id: userId } },
            },
            where: { id },
        })));
        return data.map((exam) => new notification_entity_1.NotificationEntity(exam));
    }
    async find(query, pagination, options = {}) {
        const whereInit = Object.assign({ AND: [] }, options.where);
        const { where } = (0, prisma_filters_1.prismaFilter)(whereInit, {
            query,
            skip: ['usersIds', 'userId', 'companiesIds', 'isUnread'],
        });
        if ('usersIds' in query) {
            where.AND.push({
                users: { some: { id: { in: query.usersIds } } },
            });
        }
        if ('companiesIds' in query) {
            where.AND.push({
                companies: { some: { id: { in: query.companiesIds } } },
            });
        }
        if ('isUnread' in query) {
            where.AND.push({
                confirmations: { some: { id: { not: query.userId } } },
            });
        }
        const response = await this.prisma.$transaction([
            this.prisma.notification.count({
                where,
            }),
            this.prisma.notification.count({
                where: Object.assign(Object.assign({}, where), { OR: [
                        {
                            created_at: { gte: (0, dayjs_1.default)().add(-7, 'day').toDate() },
                        },
                        {
                            confirmations: { some: { id: query.userId } },
                        },
                    ] }),
            }),
            this.prisma.notification.findMany(Object.assign(Object.assign({ take: pagination.take || 20, skip: pagination.skip || 0, orderBy: { created_at: 'desc' } }, options), { where })),
        ]);
        return {
            data: response[2].map((exam) => new notification_entity_1.NotificationEntity(exam)),
            countUnread: response[0] > response[1] ? response[0] - response[1] : 0,
            count: response[0],
        };
    }
    async findCountNude(options = {}) {
        const response = await this.prisma.$transaction([
            this.prisma.notification.count({
                where: options.where,
            }),
            this.prisma.notification.findMany(Object.assign({}, options)),
        ]);
        return {
            data: response[1].map((exam) => new notification_entity_1.NotificationEntity(exam)),
            count: response[0],
        };
    }
    async findNude(options = {}) {
        const notification = await this.prisma.notification.findMany(options);
        return notification.map((exam) => new notification_entity_1.NotificationEntity(exam));
    }
    async findFirstNude(options = {}) {
        const notification = await this.prisma.notification.findFirst(options);
        return new notification_entity_1.NotificationEntity(notification);
    }
};
NotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationRepository);
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=NotificationRepository.js.map