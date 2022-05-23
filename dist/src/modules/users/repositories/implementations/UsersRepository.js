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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const user_entity_1 = require("../../entities/user.entity");
let UsersRepository = class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
        this.count = 0;
    }
    async create(createUserDto, userCompanyDto) {
        const user = await this.prisma.user.create({
            data: Object.assign(Object.assign({}, createUserDto), { companies: { create: userCompanyDto } }),
            include: { companies: true },
        });
        return new user_entity_1.UserEntity(user);
    }
    async update(id, _a, userCompanyDto = []) {
        var { oldPassword } = _a, updateUserDto = __rest(_a, ["oldPassword"]);
        const user = await this.prisma.user.update({
            where: { id: id },
            data: Object.assign(Object.assign({}, updateUserDto), { companies: { create: userCompanyDto } }),
            include: { companies: true },
        });
        if (!user)
            return;
        return new user_entity_1.UserEntity(user);
    }
    async removeById(id) {
        const user = await this.prisma.user.delete({ where: { id: id } });
        if (!user)
            return;
        return new user_entity_1.UserEntity(user);
    }
    async findAll() {
        const users = await this.prisma.user.findMany();
        return users.map((user) => new user_entity_1.UserEntity(user));
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { companies: true },
        });
        if (!user)
            return;
        return new user_entity_1.UserEntity(user);
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { companies: true },
        });
        if (!user)
            return;
        return new user_entity_1.UserEntity(user);
    }
};
UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersRepository);
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=UsersRepository.js.map