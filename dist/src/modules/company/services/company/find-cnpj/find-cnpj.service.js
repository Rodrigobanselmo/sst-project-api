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
exports.FindCnpjService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let FindCnpjService = class FindCnpjService {
    async execute(cnpj) {
        const cnpjString = cnpj.replace(/[ˆ\D ]/g, '');
        let response;
        try {
            response = await axios_1.default.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpjString}`);
        }
        catch (error) {
            console.log(error);
            if (error.code === 'ERR_BAD_REQUEST')
                throw new common_1.BadRequestException(error.response.data.message);
            throw new common_1.InternalServerErrorException(error.response.data.message);
        }
        const result = {
            cnpj: response.data.cnpj,
            activity_start_date: response.data.data_inicio_atividade,
            cadastral_situation: String(response.data.situacao_cadastral),
            cadastral_situation_date: response.data.data_situacao_cadastral,
            address: {
                cep: response.data.cep,
                city: response.data.municipio,
                complement: response.data.complemento,
                neighborhood: response.data.bairro,
                number: response.data.numero,
                street: response.data.logradouro,
                state: response.data.uf,
            },
            cadastral_situation_description: response.data.descricao_situacao_cadastral,
            fantasy: response.data.nome_fantasia,
            legal_nature: response.data.natureza_juridica,
            legal_nature_code: String(response.data.codigo_natureza_juridica),
            name: response.data.razao_social,
            phone: response.data.ddd_telefone_1 || response.data.ddd_telefone_2,
            type: response.data.identificador_matriz_filial == 1 ? 'MATRIZ' : 'FILIAL',
            size: response.data.porte,
            primary_activity: [
                {
                    code: String(response.data.cnae_fiscal),
                    name: response.data.cnae_fiscal_descricao,
                },
            ],
            secondary_activity: response.data.cnaes_secundarios.map((cnae) => ({
                code: String(cnae.codigo),
                name: cnae.descricao,
            })),
        };
        return result;
    }
};
FindCnpjService = __decorate([
    (0, common_1.Injectable)()
], FindCnpjService);
exports.FindCnpjService = FindCnpjService;
//# sourceMappingURL=find-cnpj.service.js.map