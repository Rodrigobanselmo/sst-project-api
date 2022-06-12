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
exports.EnvironmentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const environment_entity_1 = require("../../entities/environment.entity");
let EnvironmentRepository = class EnvironmentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a) {
        var { id, companyId, workspaceId, hierarchyIds } = _a, environmentDto = __rest(_a, ["id", "companyId", "workspaceId", "hierarchyIds"]);
        const environment = await this.prisma.companyEnvironment.upsert({
            where: {
                workspaceId_companyId_id: { id: id || 'no-id', companyId, workspaceId },
            },
            create: Object.assign(Object.assign({}, environmentDto), { companyId,
                workspaceId, name: environmentDto.name, type: environmentDto.type, hierarchy: { connect: hierarchyIds.map((id) => ({ id })) } }),
            update: Object.assign(Object.assign({}, environmentDto), { hierarchy: { set: hierarchyIds.map((id) => ({ id })) } }),
        });
        return new environment_entity_1.EnvironmentEntity(environment);
    }
    async findAll(companyId, workspaceId, options) {
        const environment = await this.prisma.companyEnvironment.findMany(Object.assign({ where: { workspaceId, companyId } }, options));
        return [...environment.map((env) => new environment_entity_1.EnvironmentEntity(env))];
    }
    async delete(id, companyId, workspaceId) {
        const environment = await this.prisma.companyEnvironment.delete({
            where: {
                workspaceId_companyId_id: { workspaceId, companyId, id: id || 'no-id' },
            },
        });
        return new environment_entity_1.EnvironmentEntity(environment);
    }
};
EnvironmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnvironmentRepository);
exports.EnvironmentRepository = EnvironmentRepository;
//# sourceMappingURL=EnvironmentRepository.js.map