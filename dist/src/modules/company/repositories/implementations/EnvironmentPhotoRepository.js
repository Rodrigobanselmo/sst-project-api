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
exports.EnvironmentPhotoRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const environment_photo_entity_1 = require("../../entities/environment-photo.entity");
let EnvironmentPhotoRepository = class EnvironmentPhotoRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a) {
        var { id, environmentId } = _a, environmentPhotoDto = __rest(_a, ["id", "environmentId"]);
        const environment = await this.prisma.companyEnvironmentPhoto.upsert({
            where: { id: id || 'no-id' },
            create: Object.assign(Object.assign({}, environmentPhotoDto), { companyEnvironmentId: environmentId, name: environmentPhotoDto.name }),
            update: Object.assign({}, environmentPhotoDto),
        });
        return new environment_photo_entity_1.EnvironmentPhotoEntity(environment);
    }
    async delete(id, companyId, workspaceId) {
        const environment = await this.prisma.companyEnvironment.delete({
            where: { workspaceId_companyId_id: { workspaceId, companyId, id } },
        });
        return new environment_photo_entity_1.EnvironmentPhotoEntity(environment);
    }
};
EnvironmentPhotoRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnvironmentPhotoRepository);
exports.EnvironmentPhotoRepository = EnvironmentPhotoRepository;
//# sourceMappingURL=EnvironmentPhotoRepository.js.map