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
exports.DeleteContactsService = void 0;
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const ContactRepository_1 = require("../../../repositories/implementations/ContactRepository");
let DeleteContactsService = class DeleteContactsService {
    constructor(contactRepository) {
        this.contactRepository = contactRepository;
    }
    async execute(id, user) {
        const contactFound = await this.contactRepository.findFirstNude({
            where: {
                id,
                companyId: user.targetCompanyId,
            },
        });
        if (!(contactFound === null || contactFound === void 0 ? void 0 : contactFound.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.CONTACT_NOT_FOUND);
        if (contactFound === null || contactFound === void 0 ? void 0 : contactFound.isPrincipal)
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.CONTACT_IS_PRINCIPAL);
        const contact = await this.contactRepository.delete(id, user.targetCompanyId);
        return contact;
    }
};
DeleteContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ContactRepository_1.ContactRepository])
], DeleteContactsService);
exports.DeleteContactsService = DeleteContactsService;
//# sourceMappingURL=delete-contact.service.js.map