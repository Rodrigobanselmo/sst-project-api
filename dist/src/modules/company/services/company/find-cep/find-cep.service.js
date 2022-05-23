"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCepService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cep_types_1 = require("../../../interfaces/cep.types");
const cep_brasil_types_1 = require("../../../interfaces/cep-brasil.types");
let FindCepService = class FindCepService {
    async execute(cep) {
        const cepString = cep.replace(/[ˆ\D ]/g, '');
        let response;
        try {
            response = await axios_1.default.get(`https://brasilapi.com.br/api/cep/v1/${cepString}`);
        }
        catch (error) {
            if (error.code === 'ERR_BAD_REQUEST')
                throw new common_1.BadRequestException(error.response.data.message);
            throw new common_1.InternalServerErrorException(error.response.data.message);
        }
        const result = {
            cep: response.data.cep,
            neighborhood: response.data.neighborhood,
            city: response.data.city,
            state: response.data.state,
            street: response.data.street,
        };
        return result;
    }
};
FindCepService = __decorate([
    (0, common_1.Injectable)()
], FindCepService);
exports.FindCepService = FindCepService;
//# sourceMappingURL=find-cep.service.js.map