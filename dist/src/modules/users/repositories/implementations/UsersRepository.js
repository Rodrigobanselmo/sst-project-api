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
const professional_entity_1 = require("./../../entities/professional.entity");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const user_entity_1 = require("../../entities/user.entity");
let UsersRepository = class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
        this.count = 0;
    }
    async create(createUserDto, userCompanyDto, professional) {
        const hasCouncil = professional && (professional === null || professional === void 0 ? void 0 : professional.councils) && professional.councils.length > 0;
        const councils = hasCouncil
            ? professional.councils
            : [
                {
                    councilId: '',
                    councilUF: '',
                    councilType: '',
                },
            ];
        const user = await this.prisma.user.create({
            data: Object.assign(Object.assign({}, createUserDto), { professional: {
                    create: Object.assign(Object.assign({ type: client_1.ProfessionalTypeEnum.USER, name: '', email: createUserDto.email }, (professional && {
                        phone: professional === null || professional === void 0 ? void 0 : professional.phone,
                        cpf: professional === null || professional === void 0 ? void 0 : professional.cpf,
                        type: professional === null || professional === void 0 ? void 0 : professional.type,
                        name: professional === null || professional === void 0 ? void 0 : professional.name,
                    })), { councils: {
                            createMany: {
                                data: councils.map((c) => ({
                                    councilId: c.councilId,
                                    councilUF: c.councilUF,
                                    councilType: c.councilType,
                                })),
                            },
                        } }),
                }, companies: { create: userCompanyDto } }),
            include: { companies: true },
        });
        return new user_entity_1.UserEntity(user);
    }
    async update(id, _a, userCompanyDto = []) {
        var { oldPassword, certifications, councilId, councilUF, councilType, cpf, phone, formation, type, name, councils } = _a, updateUserDto = __rest(_a, ["oldPassword", "certifications", "councilId", "councilUF", "councilType", "cpf", "phone", "formation", "type", "name", "councils"]);
        const professional = {
            certifications,
            councilId,
            councilUF,
            councilType,
            cpf,
            phone,
            formation,
            type,
            name,
        };
        const user = await this.prisma.user.update({
            where: { id: id },
            data: Object.assign(Object.assign({}, updateUserDto), { cpf,
                name,
                phone, professional: {
                    upsert: {
                        update: Object.assign({}, professional),
                        create: Object.assign(Object.assign({}, professional), { name: name || '' }),
                    },
                }, companies: { create: userCompanyDto } }),
            include: {
                companies: true,
                professional: { include: { councils: true } },
            },
        });
        if (!user)
            return;
        if (user.professional && councils) {
            councils = councils.filter((c) => c.councilId !== '');
            if (councils.length == 0) {
                councils.push({ councilId: '', councilType: '', councilUF: '' });
            }
            const councilsCreate = await Promise.all(councils.map(async ({ councilId, councilType, councilUF }) => {
                if ((councilId && councilType && councilUF) || (councilId == '' && councilType == '' && councilUF == ''))
                    return await this.prisma.professionalCouncil.upsert({
                        create: {
                            councilId,
                            councilType,
                            councilUF,
                            professionalId: user.professional.id,
                        },
                        update: {},
                        where: {
                            councilType_councilUF_councilId_professionalId: {
                                councilId,
                                councilType,
                                councilUF,
                                professionalId: user.professional.id,
                            },
                        },
                    });
            }));
            await Promise.all(user.professional.councils.map(async (c) => {
                if (councilsCreate.find((cCreated) => (cCreated === null || cCreated === void 0 ? void 0 : cCreated.id) == c.id))
                    return;
                try {
                    await this.prisma.professionalCouncil.delete({
                        where: {
                            id: c.id,
                        },
                    });
                }
                catch (err) { }
            }));
            user.professional.councils = councilsCreate;
        }
        return new user_entity_1.UserEntity(Object.assign(Object.assign({}, user), { professional: new professional_entity_1.ProfessionalEntity(user === null || user === void 0 ? void 0 : user.professional) }));
    }
    async removeById(id) {
        const user = await this.prisma.user.delete({ where: { id: id } });
        if (!user)
            return;
        return new user_entity_1.UserEntity(user);
    }
    async findAllByCompany(companyId) {
        const users = await this.prisma.user.findMany({
            where: {
                companies: {
                    some: {
                        OR: [
                            {
                                companyId,
                            },
                            {
                                company: {
                                    receivingServiceContracts: {
                                        some: { applyingServiceCompanyId: companyId },
                                    },
                                },
                            },
                        ],
                    },
                },
            },
            include: {
                companies: {
                    include: { group: true },
                    where: {
                        OR: [
                            {
                                companyId,
                            },
                            {
                                company: {
                                    receivingServiceContracts: {
                                        some: { applyingServiceCompanyId: companyId },
                                    },
                                },
                            },
                        ],
                    },
                    orderBy: { status: 'asc' },
                },
                professional: { include: { councils: true } },
            },
        });
        return users.map((user) => new user_entity_1.UserEntity(Object.assign(Object.assign({}, user), { professional: new professional_entity_1.ProfessionalEntity(user === null || user === void 0 ? void 0 : user.professional) })));
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                companies: true,
                professional: { include: { councils: true } },
            },
        });
        if (!user)
            return;
        return new user_entity_1.UserEntity(Object.assign(Object.assign({}, user), { professional: new professional_entity_1.ProfessionalEntity(user === null || user === void 0 ? void 0 : user.professional) }));
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                companies: { include: { group: true } },
                professional: { include: { councils: true } },
            },
        });
        if (!user)
            return;
        return new user_entity_1.UserEntity(Object.assign(Object.assign({}, user), { professional: new professional_entity_1.ProfessionalEntity(user === null || user === void 0 ? void 0 : user.professional) }));
    }
    async findByGoogleExternalId(id) {
        const user = await this.prisma.user.findFirst({
            where: { googleExternalId: id },
            include: {
                companies: true,
                professional: { include: { councils: true } },
            },
        });
        if (!user)
            return;
        return new user_entity_1.UserEntity(Object.assign(Object.assign({}, user), { professional: new professional_entity_1.ProfessionalEntity(user === null || user === void 0 ? void 0 : user.professional) }));
    }
};
UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersRepository);
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=UsersRepository.js.map