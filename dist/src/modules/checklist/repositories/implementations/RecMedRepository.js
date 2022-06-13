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
exports.RecMedRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const recMed_entity_1 = require("../../entities/recMed.entity");
let RecMedRepository = class RecMedRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createRecMedDto, system) {
        const redMed = await this.prisma.recMed.create({
            data: Object.assign(Object.assign({}, createRecMedDto), { system }),
        });
        return new recMed_entity_1.RecMedEntity(redMed);
    }
    async update(_a, companyId) {
        var { id } = _a, createRecMedDto = __rest(_a, ["id"]);
        const recMed = await this.prisma.recMed.update({
            data: Object.assign({}, createRecMedDto),
            where: { id_companyId: { companyId, id: id || 'no-id' } },
        });
        return new recMed_entity_1.RecMedEntity(recMed);
    }
    async DeleteByCompanyAndIdSoft(id, companyId) {
        const recMed = await this.prisma.recMed.update({
            where: { id_companyId: { id, companyId } },
            data: { deleted_at: new Date() },
        });
        return new recMed_entity_1.RecMedEntity(recMed);
    }
    async DeleteByIdSoft(id) {
        const recMed = await this.prisma.recMed.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
        return new recMed_entity_1.RecMedEntity(recMed);
    }
};
RecMedRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecMedRepository);
exports.RecMedRepository = RecMedRepository;
//# sourceMappingURL=RecMedRepository.js.map