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
exports.CreateChecklistService = void 0;
const common_1 = require("@nestjs/common");
const ChecklistRepository_1 = require("../../../../../modules/checklist/repositories/implementations/ChecklistRepository");
let CreateChecklistService = class CreateChecklistService {
    constructor(checklistRepository) {
        this.checklistRepository = checklistRepository;
    }
    async execute(createChecklistDto, user) {
        if (!createChecklistDto.data)
            throw new common_1.BadRequestException('Data is missing');
        const system = user.isMaster;
        const ChecklistFactor = await this.checklistRepository.create(Object.assign({}, createChecklistDto), system);
        return ChecklistFactor;
    }
};
CreateChecklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ChecklistRepository_1.ChecklistRepository])
], CreateChecklistService);
exports.CreateChecklistService = CreateChecklistService;
//# sourceMappingURL=create-checklist.service.js.map