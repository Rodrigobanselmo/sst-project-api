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
exports.RiskDocInfoRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const riskDocInfo_entity_1 = require("../../entities/riskDocInfo.entity");
let RiskDocInfoRepository = class RiskDocInfoRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(_a) {
        var { companyId } = _a, createDto = __rest(_a, ["companyId"]);
        const riskFactorDocEntity = await this.prisma.riskFactorsDocInfo.upsert({
            create: Object.assign({ companyId }, createDto),
            update: Object.assign(Object.assign({}, createDto), { companyId }),
            where: Object.assign(Object.assign({}, (!createDto.id && {
                companyId_riskId_hierarchyId: {
                    companyId,
                    riskId: createDto.riskId,
                    hierarchyId: (createDto === null || createDto === void 0 ? void 0 : createDto.hierarchyId) || '',
                },
            })), (createDto.id && {
                id: createDto.id,
            })),
        });
        return new riskDocInfo_entity_1.RiskDocInfoEntity(riskFactorDocEntity);
    }
    async findFirstNude(options = {}) {
        const companyClinic = await this.prisma.riskFactorsDocInfo.findFirst(Object.assign({}, options));
        return new riskDocInfo_entity_1.RiskDocInfoEntity(companyClinic);
    }
};
RiskDocInfoRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RiskDocInfoRepository);
exports.RiskDocInfoRepository = RiskDocInfoRepository;
//# sourceMappingURL=RiskDocInfoRepository.js.map