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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpiController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const epi_dto_1 = require("../../dto/epi.dto");
const create_epi_service_1 = require("../../services/epi/create-epi/create-epi.service");
const find_ca_epi_service_1 = require("../../services/epi/find-ca-epi /find-ca-epi.service");
const find_epi_service_1 = require("../../services/epi/find-epi/find-epi.service");
const update_epi_service_1 = require("../../services/epi/update-epi/update-epi.service");
let EpiController = class EpiController {
    constructor(createEpiService, updateEpiService, findByCAEpiService, findEpiService) {
        this.createEpiService = createEpiService;
        this.updateEpiService = updateEpiService;
        this.findByCAEpiService = findByCAEpiService;
        this.findEpiService = findEpiService;
    }
    create(createEpiDto) {
        return this.createEpiService.execute(createEpiDto);
    }
    async update(epiId, updateEpiDto) {
        return this.updateEpiService.execute(epiId, updateEpiDto);
    }
    async findByCA(ca) {
        return this.findByCAEpiService.execute(ca);
    }
    async find(query) {
        return this.findEpiService.execute(query);
    }
};
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/epi.entity").EpiEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [epi_dto_1.CreateEpiDto]),
    __metadata("design:returntype", void 0)
], EpiController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('/:epiId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/epi.entity").EpiEntity }),
    __param(0, (0, common_1.Param)('epiId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, epi_dto_1.UpdateEpiDto]),
    __metadata("design:returntype", Promise)
], EpiController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/:ca'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/epi.entity").EpiEntity }),
    __param(0, (0, common_1.Param)('ca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EpiController.prototype, "findByCA", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [epi_dto_1.FindEpiDto]),
    __metadata("design:returntype", Promise)
], EpiController.prototype, "find", null);
EpiController = __decorate([
    (0, common_1.Controller)('epi'),
    __metadata("design:paramtypes", [create_epi_service_1.CreateEpiService,
        update_epi_service_1.UpdateEpiService,
        find_ca_epi_service_1.FindByCAEpiService,
        find_epi_service_1.FindEpiService])
], EpiController);
exports.EpiController = EpiController;
//# sourceMappingURL=epi.controller.js.map