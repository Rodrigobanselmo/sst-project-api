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
exports.DeleteHomoGroupService = void 0;
const common_1 = require("@nestjs/common");
const HomoGroupRepository_1 = require("../../../../../modules/company/repositories/implementations/HomoGroupRepository");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
let DeleteHomoGroupService = class DeleteHomoGroupService {
    constructor(homoGroupRepository) {
        this.homoGroupRepository = homoGroupRepository;
    }
    async execute(id, userPayloadDto) {
        const foundHomoGroup = await this.homoGroupRepository.findHomoGroupByCompanyAndId(id, userPayloadDto.targetCompanyId);
        if (!foundHomoGroup)
            throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.GHO_NOT_FOUND);
        const homoGroups = await this.homoGroupRepository.deleteById(id);
        return homoGroups;
    }
};
DeleteHomoGroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [HomoGroupRepository_1.HomoGroupRepository])
], DeleteHomoGroupService);
exports.DeleteHomoGroupService = DeleteHomoGroupService;
//# sourceMappingURL=delete-homo-group.service.js.map