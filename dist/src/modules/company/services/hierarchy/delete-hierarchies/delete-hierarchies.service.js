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
exports.DeleteHierarchyService = void 0;
const common_1 = require("@nestjs/common");
const HierarchyRepository_1 = require("../../../../../modules/company/repositories/implementations/HierarchyRepository");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
let DeleteHierarchyService = class DeleteHierarchyService {
    constructor(hierarchyRepository) {
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(id, user) {
        const hierarchy = await this.hierarchyRepository.findAllHierarchyByCompanyAndId(id, user.targetCompanyId);
        if (!hierarchy)
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE);
        const hierarchies = await this.hierarchyRepository.deleteById(id);
        return hierarchies;
    }
};
DeleteHierarchyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [HierarchyRepository_1.HierarchyRepository])
], DeleteHierarchyService);
exports.DeleteHierarchyService = DeleteHierarchyService;
//# sourceMappingURL=delete-hierarchies.service.js.map