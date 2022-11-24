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
exports.UpdateChecklistService = void 0;
const common_1 = require("@nestjs/common");
const ChecklistRepository_1 = require("../../../repositories/implementations/ChecklistRepository");
let UpdateChecklistService = class UpdateChecklistService {
    constructor(checklistRepository) {
        this.checklistRepository = checklistRepository;
    }
    async execute(id, updateChecklistDto) {
        const Checklist = await this.checklistRepository.update(id, updateChecklistDto);
        if (!Checklist.id)
            throw new common_1.NotFoundException('Checklist not found');
        return Checklist;
    }
};
UpdateChecklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ChecklistRepository_1.ChecklistRepository])
], UpdateChecklistService);
exports.UpdateChecklistService = UpdateChecklistService;
//# sourceMappingURL=update-checklist.service.js.map