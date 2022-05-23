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
exports.UpdateRecMedService = void 0;
const common_1 = require("@nestjs/common");
const RecMedRepository_1 = require("../../../../../modules/checklist/repositories/implementations/RecMedRepository");
let UpdateRecMedService = class UpdateRecMedService {
    constructor(recMedRepository) {
        this.recMedRepository = recMedRepository;
    }
    async execute(id, updateRecMedDto, user) {
        const companyId = user.targetCompanyId;
        const risk = await this.recMedRepository.update(Object.assign({ id }, updateRecMedDto), companyId);
        if (!risk.id)
            throw new common_1.NotFoundException('data not found');
        return risk;
    }
};
UpdateRecMedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RecMedRepository_1.RecMedRepository])
], UpdateRecMedService);
exports.UpdateRecMedService = UpdateRecMedService;
//# sourceMappingURL=update-rec-med.service.js.map