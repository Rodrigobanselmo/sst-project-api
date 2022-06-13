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
exports.GenerateSourceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const generateSource_entity_1 = require("../../entities/generateSource.entity");
let GenerateSourceRepository = class GenerateSourceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a, system) {
        var { recMeds } = _a, createGenerateSourceDto = __rest(_a, ["recMeds"]);
        const hasRecMed = recMeds
            ? recMeds.filter(({ recName, medName }) => recName || medName).length > 0
            : false;
        const redMed = await this.prisma.generateSource.create({
            data: Object.assign(Object.assign({}, createGenerateSourceDto), { system, recMeds: hasRecMed
                    ? {
                        createMany: {
                            data: recMeds.map((_a) => {
                                var rm = __rest(_a, []);
                                return (Object.assign(Object.assign({ system }, rm), { riskId: createGenerateSourceDto.riskId, companyId: createGenerateSourceDto.companyId }));
                            }),
                            skipDuplicates: true,
                        },
                    }
                    : undefined }),
            include: { recMeds: true },
        });
        return new generateSource_entity_1.GenerateSourceEntity(redMed);
    }
    async update(_a, system, companyId) {
        var { id, recMeds, riskId } = _a, createGenerateSourceDto = __rest(_a, ["id", "recMeds", "riskId"]);
        const generateSource = await this.prisma.generateSource.update({
            data: Object.assign(Object.assign({}, createGenerateSourceDto), { recMeds: {
                    upsert: !recMeds
                        ? []
                        : recMeds
                            .filter(({ recName, medName }) => recName || medName)
                            .map((_a) => {
                            var { id } = _a, rm = __rest(_a, ["id"]);
                            return {
                                create: Object.assign(Object.assign({ system, companyId }, rm), { riskId }),
                                update: Object.assign(Object.assign({ system }, rm), { riskId }),
                                where: { id: id || 'no-id' },
                            };
                        }),
                } }),
            where: { id_companyId: { companyId, id: id || 'no-id' } },
        });
        await Promise.all(recMeds
            .filter(({ id, recName, medName }) => id && !recName && !medName)
            .map(async ({ id: _id }) => {
            await this.prisma.generateSource.update({
                data: Object.assign(Object.assign({}, createGenerateSourceDto), { recMeds: {
                        connect: { id_companyId: { companyId, id: _id || 'no-id' } },
                    } }),
                where: { id_companyId: { companyId, id: id || 'no-id' } },
            });
        }));
        return new generateSource_entity_1.GenerateSourceEntity(generateSource);
    }
    async findById(id, companyId) {
        const generate = await this.prisma.generateSource.findUnique({
            where: { id_companyId: { id, companyId } },
        });
        return new generateSource_entity_1.GenerateSourceEntity(generate);
    }
    async DeleteByCompanyAndIdSoft(id, companyId) {
        const generate = await this.prisma.generateSource.update({
            where: { id_companyId: { id, companyId } },
            data: { deleted_at: new Date() },
        });
        return new generateSource_entity_1.GenerateSourceEntity(generate);
    }
    async DeleteByIdSoft(id) {
        const generate = await this.prisma.generateSource.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return new generateSource_entity_1.GenerateSourceEntity(generate);
    }
};
GenerateSourceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GenerateSourceRepository);
exports.GenerateSourceRepository = GenerateSourceRepository;
//# sourceMappingURL=GenerateSourceRepository.js.map