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
exports.UpdateHierarchyHomoGroupService = void 0;
const EmployeePPPHistoryRepository_1 = require("./../../../repositories/implementations/EmployeePPPHistoryRepository");
const common_1 = require("@nestjs/common");
const HomoGroupRepository_1 = require("../../../repositories/implementations/HomoGroupRepository");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
let UpdateHierarchyHomoGroupService = class UpdateHierarchyHomoGroupService {
    constructor(homoGroupRepository, employeePPPHistoryRepository) {
        this.homoGroupRepository = homoGroupRepository;
        this.employeePPPHistoryRepository = employeePPPHistoryRepository;
    }
    async execute(homoGroup, userPayloadDto) {
        const foundHomoGroup = await this.homoGroupRepository.findFirstNude({
            where: {
                companyId: userPayloadDto.targetCompanyId,
                hierarchyOnHomogeneous: {
                    some: {
                        workspaceId: homoGroup.workspaceId,
                        id: { in: homoGroup.ids },
                    },
                },
            },
            select: {
                id: true,
                hierarchyOnHomogeneous: {
                    select: { id: true },
                    where: {
                        workspaceId: homoGroup.workspaceId,
                        id: { in: homoGroup.ids },
                    },
                },
            },
        });
        if (!(foundHomoGroup === null || foundHomoGroup === void 0 ? void 0 : foundHomoGroup.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.GHO_NOT_FOUND);
        if ((foundHomoGroup === null || foundHomoGroup === void 0 ? void 0 : foundHomoGroup.hierarchyOnHomogeneous.length) !== homoGroup.ids.length)
            throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.GHO_NOT_FOUND);
        const data = await this.homoGroupRepository.updateHierarchyHomo(homoGroup);
        if ('startDate' in homoGroup || 'endDate' in homoGroup)
            this.employeePPPHistoryRepository.updateManyNude({
                data: { sendEvent: true },
                where: {
                    employee: {
                        companyId: userPayloadDto.targetCompanyId,
                        hierarchyHistory: {
                            some: {
                                hierarchy: {
                                    hierarchyOnHomogeneous: {
                                        some: { id: { in: homoGroup.ids } },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        return data;
    }
};
UpdateHierarchyHomoGroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [HomoGroupRepository_1.HomoGroupRepository, EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository])
], UpdateHierarchyHomoGroupService);
exports.UpdateHierarchyHomoGroupService = UpdateHierarchyHomoGroupService;
//# sourceMappingURL=update-hierarchy-homo-group.service.js.map