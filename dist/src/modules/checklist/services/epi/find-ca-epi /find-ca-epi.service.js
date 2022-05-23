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
exports.FindByCAEpiService = void 0;
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const EpiRepository_1 = require("../../../repositories/implementations/EpiRepository");
let FindByCAEpiService = class FindByCAEpiService {
    constructor(epiRepository) {
        this.epiRepository = epiRepository;
    }
    async execute(ca) {
        const EpiFactor = await this.epiRepository.findByCA(ca);
        if (!(EpiFactor === null || EpiFactor === void 0 ? void 0 : EpiFactor.ca)) {
            throw new common_1.NotFoundException(errorMessage_1.ErrorChecklistEnum.EPI_NOT_FOUND);
        }
        return EpiFactor;
    }
};
FindByCAEpiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EpiRepository_1.EpiRepository])
], FindByCAEpiService);
exports.FindByCAEpiService = FindByCAEpiService;
//# sourceMappingURL=find-ca-epi.service.js.map