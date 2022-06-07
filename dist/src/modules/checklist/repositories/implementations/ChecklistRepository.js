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
exports.ChecklistRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const checklist_entity_1 = require("../../entities/checklist.entity");
let ChecklistRepository = class ChecklistRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(_a, system) {
        var { data } = _a, createChecklistDto = __rest(_a, ["data"]);
        const checklist = await this.prisma.checklist.create({
            data: Object.assign(Object.assign({}, createChecklistDto), { data: {
                    create: data,
                }, system }),
            include: { data: true },
        });
        return new checklist_entity_1.ChecklistEntity(checklist);
    }
    async findAllAvailable(companyId) {
        const checklists = await this.prisma.checklist.findMany({
            where: { OR: [{ system: true }, { companyId }] },
        });
        return checklists.map((checklist) => new checklist_entity_1.ChecklistEntity(checklist));
    }
    async findChecklistData(id) {
        const checklist = await this.prisma.checklist.findFirst({
            where: { id },
            include: { data: true },
        });
        return new checklist_entity_1.ChecklistEntity(checklist);
    }
    async update(id, _a) {
        var { data: { json }, companyId } = _a, updateChecklistDto = __rest(_a, ["data", "companyId"]);
        const checklist = await this.prisma.checklist.update({
            data: Object.assign(Object.assign({}, updateChecklistDto), { data: { update: { json } } }),
            where: { id_companyId: { id, companyId: companyId } },
            include: { data: true },
        });
        return new checklist_entity_1.ChecklistEntity(checklist);
    }
};
ChecklistRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChecklistRepository);
exports.ChecklistRepository = ChecklistRepository;
//# sourceMappingURL=ChecklistRepository.js.map