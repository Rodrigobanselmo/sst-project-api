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
exports.PdfKitDataService = void 0;
const common_1 = require("@nestjs/common");
const aso_data_service_1 = require("../aso/aso-data.service");
const prontuario_data_service_1 = require("../prontuario/prontuario-data.service");
let PdfKitDataService = class PdfKitDataService {
    constructor(pdfProntuarioDataService, pdfAsoDataService) {
        this.pdfProntuarioDataService = pdfProntuarioDataService;
        this.pdfAsoDataService = pdfAsoDataService;
    }
    async execute(employeeId, userPayloadDto, asoId) {
        const companyId = userPayloadDto.targetCompanyId;
        const aso = await this.pdfAsoDataService.execute(employeeId, userPayloadDto, asoId);
        const examination = await this.pdfProntuarioDataService.getExamination(aso.employee, companyId);
        const questions = await this.pdfProntuarioDataService.getQuestions(aso.employee, companyId);
        return {
            aso,
            prontuario: {
                examination,
                questions,
            },
        };
    }
};
PdfKitDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prontuario_data_service_1.PdfProntuarioDataService, aso_data_service_1.PdfAsoDataService])
], PdfKitDataService);
exports.PdfKitDataService = PdfKitDataService;
//# sourceMappingURL=kit-data.service.js.map