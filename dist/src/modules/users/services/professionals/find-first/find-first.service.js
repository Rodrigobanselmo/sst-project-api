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
exports.FindFirstProfessionalService = void 0;
const common_1 = require("@nestjs/common");
const ProfessionalRepository_1 = require("../../../repositories/implementations/ProfessionalRepository");
let FindFirstProfessionalService = class FindFirstProfessionalService {
    constructor(professionalRepository) {
        this.professionalRepository = professionalRepository;
    }
    async execute({ councilId, councilType, councilUF, cpf, email }) {
        const professionals = await this.professionalRepository.findFirstNude({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                councils: {
                                    some: {
                                        councilId: { equals: councilId || 'not-found' },
                                        councilType: { equals: councilType || 'not-found' },
                                        councilUF: { equals: councilUF || 'not-found' },
                                    },
                                },
                            },
                        ],
                    },
                    { cpf: { equals: cpf || 'not-found' } },
                    { user: { email: { equals: email || 'not-found' } } },
                    { email: { equals: email || 'not-found' } },
                ],
            },
            include: { councils: true },
        });
        return professionals;
    }
};
FindFirstProfessionalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ProfessionalRepository_1.ProfessionalRepository])
], FindFirstProfessionalService);
exports.FindFirstProfessionalService = FindFirstProfessionalService;
//# sourceMappingURL=find-first.service.js.map