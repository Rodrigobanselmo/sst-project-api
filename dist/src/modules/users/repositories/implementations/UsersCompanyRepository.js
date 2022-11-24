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
exports.UsersCompanyRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const userCompany_entity_1 = require("../../entities/userCompany.entity");
let UsersCompanyRepository = class UsersCompanyRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertMany(_a) {
        var { userId, companyId, companiesIds } = _a, updateUserCompanyDto = __rest(_a, ["userId", "companyId", "companiesIds"]);
        const UserCompanies = await Promise.all(companiesIds.map(async (companyId) => await this.prisma.userCompany.upsert({
            create: Object.assign(Object.assign({}, updateUserCompanyDto), { userId, companyId }),
            update: updateUserCompanyDto,
            where: { companyId_userId: { companyId, userId } },
            include: { group: true },
        })));
        return UserCompanies.map((UserCompany) => new userCompany_entity_1.UserCompanyEntity(UserCompany));
    }
    async update(_a) {
        var { userId, companyId, companiesIds } = _a, updateUserCompanyDto = __rest(_a, ["userId", "companyId", "companiesIds"]);
        const UserCompany = await this.prisma.userCompany.update({
            data: updateUserCompanyDto,
            where: { companyId_userId: { companyId, userId } },
            include: { group: true },
        });
        return new userCompany_entity_1.UserCompanyEntity(UserCompany);
    }
    async findByUserIdAndCompanyId(userId, companyId) {
        const UserCompany = await this.prisma.userCompany.findUnique({
            where: { companyId_userId: { userId, companyId } },
        });
        if (!UserCompany)
            return;
        return new userCompany_entity_1.UserCompanyEntity(UserCompany);
    }
    async deleteAllFromConsultant(userId, companyId) {
        await this.prisma.userCompany.deleteMany({
            where: {
                OR: [
                    { userId, companyId },
                    {
                        userId,
                        company: {
                            receivingServiceContracts: {
                                some: { applyingServiceCompanyId: companyId },
                            },
                        },
                    },
                ],
            },
        });
    }
};
UsersCompanyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersCompanyRepository);
exports.UsersCompanyRepository = UsersCompanyRepository;
//# sourceMappingURL=UsersCompanyRepository.js.map