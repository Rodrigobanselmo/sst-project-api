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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpsertAccessGroupsService = void 0;
const common_1 = require("@nestjs/common");
const AuthGroupRepository_1 = require("./../../../repositories/implementations/AuthGroupRepository");
let UpsertAccessGroupsService = class UpsertAccessGroupsService {
    constructor(authGroupRepository) {
        this.authGroupRepository = authGroupRepository;
    }
    async execute(UpsertAccessGroupsDto, user) {
        const system = user.isSystem;
        const company = await this.authGroupRepository.upsert(Object.assign(Object.assign({}, UpsertAccessGroupsDto), { companyId: user.targetCompanyId }), system);
        return company;
    }
};
UpsertAccessGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [AuthGroupRepository_1.AuthGroupRepository])
], UpsertAccessGroupsService);
exports.UpsertAccessGroupsService = UpsertAccessGroupsService;
//# sourceMappingURL=upsert-access-group.service.js.map