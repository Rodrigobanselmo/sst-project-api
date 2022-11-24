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
exports.CreateContactsService = void 0;
const common_1 = require("@nestjs/common");
const ContactRepository_1 = require("../../../repositories/implementations/ContactRepository");
let CreateContactsService = class CreateContactsService {
    constructor(contactRepository) {
        this.contactRepository = contactRepository;
    }
    async execute(UpsertContactsDto, user) {
        const contact = await this.contactRepository.create(Object.assign(Object.assign({}, UpsertContactsDto), { companyId: user.targetCompanyId }));
        return contact;
    }
};
CreateContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ContactRepository_1.ContactRepository])
], CreateContactsService);
exports.CreateContactsService = CreateContactsService;
//# sourceMappingURL=create-contact.service.js.map