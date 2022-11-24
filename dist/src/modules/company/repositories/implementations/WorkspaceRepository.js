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
exports.WorkspaceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const workspace_entity_1 = require("../../entities/workspace.entity");
let WorkspaceRepository = class WorkspaceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a) {
        var { address, companyId } = _a, workspaceDto = __rest(_a, ["address", "companyId"]);
        const workspace = await this.prisma.workspace.create({
            data: Object.assign(Object.assign({}, workspaceDto), { companyId: companyId, address: address
                    ? {
                        create: Object.assign({}, address),
                    }
                    : undefined }),
            include: {
                address: true,
            },
        });
        return new workspace_entity_1.WorkspaceEntity(workspace);
    }
    async findById(id) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id },
            include: { address: true },
        });
        return new workspace_entity_1.WorkspaceEntity(workspace);
    }
    async findByCompany(companyId) {
        const workspaces = await this.prisma.workspace.findMany({
            where: { companyId },
        });
        return [...workspaces.map((workspace) => new workspace_entity_1.WorkspaceEntity(workspace))];
    }
};
WorkspaceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceRepository);
exports.WorkspaceRepository = WorkspaceRepository;
//# sourceMappingURL=WorkspaceRepository.js.map