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
exports.DeleteSoftRecMedService = void 0;
const common_1 = require("@nestjs/common");
const RecMedRepository_1 = require("../../../repositories/implementations/RecMedRepository");
const isMater_1 = require("../../../../../shared/utils/isMater");
const recMed_entity_1 = require("../../../entities/recMed.entity");
let DeleteSoftRecMedService = class DeleteSoftRecMedService {
    constructor(recMedRepository) {
        this.recMedRepository = recMedRepository;
    }
    async execute(id, userPayloadDto) {
        const user = (0, isMater_1.isMaster)(userPayloadDto);
        const companyId = user.companyId;
        let recMed;
        if (user.isMaster) {
            recMed = await this.recMedRepository.DeleteByIdSoft(id);
        }
        else {
            recMed = await this.recMedRepository.DeleteByCompanyAndIdSoft(id, companyId);
        }
        if (!recMed.id)
            throw new common_1.NotFoundException('data not found');
        return recMed;
    }
};
DeleteSoftRecMedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RecMedRepository_1.RecMedRepository])
], DeleteSoftRecMedService);
exports.DeleteSoftRecMedService = DeleteSoftRecMedService;
//# sourceMappingURL=delete-soft-rec-med.service.js.map