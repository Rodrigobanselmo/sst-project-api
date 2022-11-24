'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESocialMethodsProvider = void 0;
const common_1 = require("@nestjs/common");
const xmldom_1 = require("@xmldom/xmldom");
const fs_1 = __importDefault(require("fs"));
const jszip_1 = __importDefault(require("jszip"));
const pfx_to_pem_1 = __importDefault(require("pfx-to-pem"));
const uuid_1 = require("uuid");
const xml_crypto_1 = require("xml-crypto");
const xml_formatter_1 = __importDefault(require("xml-formatter"));
const CompanyRepository_1 = require("../../../../modules/company/repositories/implementations/CompanyRepository");
const DayJSProvider_1 = require("../../DateProvider/implementations/DayJSProvider");
const companyName_1 = require("./../../../utils/companyName");
class ESocialGenerateId {
    constructor(cpfCnpj, options) {
        this.index = 1;
        this.cpfCnpj = cpfCnpj;
        this.type = options === null || options === void 0 ? void 0 : options.type;
    }
    newId() {
        const data = (0, DayJSProvider_1.dayjs)().format('YYYYMMDDHHmmss');
        const ID = `ID${this.type || 1}${this.cpfCnpj.padStart(14)}${data}${String(this.index).padStart(5, '0')}`;
        this.index++;
        return ID;
    }
}
let ESocialMethodsProvider = class ESocialMethodsProvider {
    constructor(companyRepository, dayJSProvider) {
        this.companyRepository = companyRepository;
        this.dayJSProvider = dayJSProvider;
    }
    signEvent({ cert: { certificate, key }, xml }) {
        const sig = new xml_crypto_1.SignedXml();
        function MyKeyInfo() {
            this.getKeyInfo = function () {
                return `<X509Data><X509Certificate>${certificate
                    .replace('-----BEGIN CERTIFICATE-----', '')
                    .replaceAll('\n', '')
                    .replace('-----END CERTIFICATE-----', '')}</X509Certificate></X509Data>`;
            };
            this.getKey = function () {
                return certificate;
            };
        }
        sig.canonicalizationAlgorithm = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
        sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
        sig.keyInfoProvider = new MyKeyInfo();
        sig.signingKey = key;
        sig.references = [
            {
                xpath: '/*',
                transforms: ['http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'],
                digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256',
                isEmptyUri: true,
            },
        ];
        sig.computeSignature(xml, {});
        const signXML = sig.getSignedXml();
        return signXML;
    }
    checkSignature({ cert: { certificate }, xml: signXML }) {
        function MyKeyInfo() {
            this.getKey = function () {
                return certificate;
            };
        }
        const doc = new xmldom_1.DOMParser().parseFromString(signXML.toString());
        const signature = (0, xml_crypto_1.xpath)(doc, "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0];
        const sig2 = new xml_crypto_1.SignedXml();
        sig2.keyInfoProvider = new MyKeyInfo();
        sig2.loadSignature(signature);
        const res = sig2.checkSignature(signXML);
        if (!res)
            console.log('validate signXML errors: ', sig2.validationErrors);
        console.log('is valid signature: ', res);
        return signXML;
    }
    generateId(cpfCnpj, { type, seqNum, index }) {
        const data = this.dayJSProvider.dayjs().format('YYYYMMDDHHmmss');
        const IDs = (index ? [index] : Array.from({ length: seqNum || 1 })).map((num) => `ID${type || 1}${cpfCnpj.padStart(14)}${data}${String(num).padStart(5)}`);
        return IDs;
    }
    classGenerateId(cpfCnpj, options) {
        return new ESocialGenerateId(cpfCnpj, options);
    }
    async getCompany(companyId, options) {
        var _a, _b, _c, _d, _e, _f;
        const groupSpreed = ((_a = options.select) === null || _a === void 0 ? void 0 : _a.group) && typeof ((_b = options.select) === null || _b === void 0 ? void 0 : _b.group) !== 'boolean' ? (_c = options.select) === null || _c === void 0 ? void 0 : _c.group : {};
        const company = await this.companyRepository.findFirstNude({
            where: { id: companyId },
            select: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ id: true, esocialStart: true, esocialSend: true, cnpj: true }, (!!(options === null || options === void 0 ? void 0 : options.doctor) && {
                doctorResponsible: {
                    include: { professional: { select: { name: true, cpf: true } } },
                },
            })), { cert: !!(options === null || options === void 0 ? void 0 : options.cert) }), (!!(options === null || options === void 0 ? void 0 : options.report) && {
                report: true,
            })), (!!(options === null || options === void 0 ? void 0 : options.cert) && {
                receivingServiceContracts: {
                    select: {
                        applyingServiceCompany: {
                            select: { cert: true },
                        },
                    },
                },
            })), options.select), { group: {
                    select: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (!!(options === null || options === void 0 ? void 0 : options.doctor) && {
                        doctorResponsible: {
                            include: { professional: { select: { name: true, cpf: true } } },
                        },
                    })), { esocialStart: true }), (!!(options === null || options === void 0 ? void 0 : options.cert) && {
                        company: { select: { cert: true } },
                    })), { esocialSend: true }), groupSpreed.select),
                } }),
        });
        const cert = (company === null || company === void 0 ? void 0 : company.cert) || ((_d = company === null || company === void 0 ? void 0 : company.group) === null || _d === void 0 ? void 0 : _d.cert) || ((_f = (_e = company === null || company === void 0 ? void 0 : company.receivingServiceContracts) === null || _e === void 0 ? void 0 : _e[0].applyingServiceCompany) === null || _f === void 0 ? void 0 : _f.cert);
        if ((options === null || options === void 0 ? void 0 : options.cert) && !cert)
            throw new common_1.BadRequestException('Certificado digital não cadastrado');
        return { cert, company };
    }
    async createZipFolder({ company, eventsXml, type }) {
        const today = this.dayJSProvider.format(new Date(), 'DD-MM-YYYY');
        const fileName = `eSocial ${(0, companyName_1.getCompanyName)(company)} ${today} - S${type}`;
        const zip = new jszip_1.default();
        const folder = zip.folder(fileName);
        eventsXml.forEach((event) => {
            folder.file(`EXAME_${event.id}.xml`, (0, xml_formatter_1.default)(event.xml, {
                indentation: '  ',
                filter: (node) => node.type !== 'Comment',
                collapseContent: true,
                lineSeparator: '\n',
            }));
        });
        const zipFile = await zip.generateAsync({ type: 'nodebuffer' });
        return { zipFile, fileName };
    }
    async convertPfxToPem({ file, password }) {
        var _a, _b;
        const path = `tmp/${(0, uuid_1.v4)()}.pfx`;
        fs_1.default.writeFileSync(path, file.buffer);
        let pem;
        try {
            pem = await pfx_to_pem_1.default.toPem({
                path,
                password,
            });
            fs_1.default.unlinkSync(path);
        }
        catch (err) {
            fs_1.default.unlinkSync(path);
            const passError = err.message.includes('password?');
            if (passError)
                throw new common_1.BadRequestException('Senha informada inválida');
            const certNotFOund = err.message.includes('such file or direct');
            if (certNotFOund)
                throw new common_1.InternalServerErrorException('Certificado não encontrado');
            throw new common_1.InternalServerErrorException('Não foi possivel converter o certificado');
        }
        const notAfter = this.dayJSProvider.dayjs((_a = pem === null || pem === void 0 ? void 0 : pem.attributes) === null || _a === void 0 ? void 0 : _a.notAfter);
        const notBefore = this.dayJSProvider.dayjs((_b = pem === null || pem === void 0 ? void 0 : pem.attributes) === null || _b === void 0 ? void 0 : _b.notBefore);
        if (notAfter.toDate() < new Date())
            throw new common_1.BadRequestException(`Certificado digital da empresa vencido (${notAfter.format('DD/MM/YYYY')})`);
        if (notBefore.toDate() > new Date())
            throw new common_1.BadRequestException(`Certificado digital da empresa válido a partir de ${notBefore.format('DD/MM/YYYY')}`);
        return {
            certificate: pem.certificate,
            key: pem.key,
            notAfter: notAfter.toDate(),
            notBefore: notBefore.toDate(),
        };
    }
};
ESocialMethodsProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyRepository_1.CompanyRepository, DayJSProvider_1.DayJSProvider])
], ESocialMethodsProvider);
exports.ESocialMethodsProvider = ESocialMethodsProvider;
//# sourceMappingURL=ESocialMethodsProvider.js.map