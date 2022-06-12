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
exports.DeleteEnvironmentService = void 0;
const common_1 = require("@nestjs/common");
const EnvironmentRepository_1 = require("../../../repositories/implementations/EnvironmentRepository");
let DeleteEnvironmentService = class DeleteEnvironmentService {
    constructor(environmentRepository) {
        this.environmentRepository = environmentRepository;
    }
    async execute(id, workspaceId, userPayloadDto) {
        const environments = await this.environmentRepository.delete(id, userPayloadDto.targetCompanyId, workspaceId);
        return environments;
    }
};
DeleteEnvironmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EnvironmentRepository_1.EnvironmentRepository])
], DeleteEnvironmentService);
exports.DeleteEnvironmentService = DeleteEnvironmentService;
//# sourceMappingURL=delete-environment.service.js.map