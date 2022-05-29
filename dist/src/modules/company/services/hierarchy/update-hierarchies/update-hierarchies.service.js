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
exports.UpdateHierarchyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const HierarchyRepository_1 = require("../../../../../modules/company/repositories/implementations/HierarchyRepository");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
let UpdateHierarchyService = class UpdateHierarchyService {
    constructor(hierarchyRepository) {
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(hierarchy, user) {
        if (hierarchy.parentId && hierarchy.type === client_1.HierarchyEnum.DIRECTORY) {
            throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.UPDATE_HIERARCHY_WITH_PARENT);
        }
        const hierarchies = await this.hierarchyRepository.update(hierarchy, user.targetCompanyId);
        return hierarchies;
    }
};
UpdateHierarchyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [HierarchyRepository_1.HierarchyRepository])
], UpdateHierarchyService);
exports.UpdateHierarchyService = UpdateHierarchyService;
//# sourceMappingURL=update-hierarchies.service.js.map