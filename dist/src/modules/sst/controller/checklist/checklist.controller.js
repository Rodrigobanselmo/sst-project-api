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
exports.ChecklistController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const create_checklist_dto_1 = require("../../dto/create-checklist.dto");
const update_checklist_dto_1 = require("../../dto/update-checklist.dto");
const create_checklist_service_1 = require("../../services/checklist/create-checklist/create-checklist.service");
const find_available_checklist_service_1 = require("../../services/checklist/find-available-checklist/find-available-checklist.service");
const find_checklist_data_service_1 = require("../../services/checklist/find-checklist-data/find-checklist-data.service");
const update_checklist_service_1 = require("../../services/checklist/update-checklist/update-checklist.service");
let ChecklistController = class ChecklistController {
    constructor(createChecklistService, findAvailableChecklistService, findChecklistDataService, updateChecklistService) {
        this.createChecklistService = createChecklistService;
        this.findAvailableChecklistService = findAvailableChecklistService;
        this.findChecklistDataService = findChecklistDataService;
        this.updateChecklistService = updateChecklistService;
    }
    create(userPayloadDto, createChecklistDto) {
        return this.createChecklistService.execute(createChecklistDto, userPayloadDto);
    }
    findAllAvailable(userPayloadDto) {
        return this.findAvailableChecklistService.execute(userPayloadDto);
    }
    findChecklistData(checklistId, userPayloadDto) {
        return this.findChecklistDataService.execute(checklistId, userPayloadDto);
    }
    async update(checklistId, updateChecklistDto) {
        return this.updateChecklistService.execute(checklistId, updateChecklistDto);
    }
};
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/checklist.entity").ChecklistEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, create_checklist_dto_1.CreateChecklistDto]),
    __metadata("design:returntype", void 0)
], ChecklistController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/:companyId?'),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/checklist.entity").ChecklistEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], ChecklistController.prototype, "findAllAvailable", null);
__decorate([
    (0, common_1.Get)('/data/:checklistId/:companyId?'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/checklist.entity").ChecklistEntity }),
    __param(0, (0, common_1.Param)('checklistId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], ChecklistController.prototype, "findChecklistData", null);
__decorate([
    (0, common_1.Patch)('/:checklistId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/checklist.entity").ChecklistEntity }),
    __param(0, (0, common_1.Param)('checklistId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_checklist_dto_1.UpdateChecklistDto]),
    __metadata("design:returntype", Promise)
], ChecklistController.prototype, "update", null);
ChecklistController = __decorate([
    (0, common_1.Controller)('checklist'),
    __metadata("design:paramtypes", [create_checklist_service_1.CreateChecklistService,
        find_available_checklist_service_1.FindAvailableChecklistService,
        find_checklist_data_service_1.FindChecklistDataService,
        update_checklist_service_1.UpdateChecklistService])
], ChecklistController);
exports.ChecklistController = ChecklistController;
//# sourceMappingURL=checklist.controller.js.map