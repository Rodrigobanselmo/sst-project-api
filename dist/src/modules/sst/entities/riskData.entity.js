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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskFactorDataEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const hierarchy_entity_1 = require("../../company/entities/hierarchy.entity");
const homoGroup_entity_1 = require("../../company/entities/homoGroup.entity");
const origin_risk_1 = require("../../../shared/constants/maps/origin-risk");
const matriz_1 = require("../../../shared/utils/matriz");
const risk_data_json_types_1 = require("../../company/interfaces/risk-data-json.types");
const heatTable_constant_1 = require("../../documents/constants/heatTable.constant");
const epi_entity_1 = require("./epi.entity");
const recMed_entity_1 = require("./recMed.entity");
const risk_entity_1 = require("./risk.entity");
const epiRiskData_entity_1 = require("./epiRiskData.entity");
const engsRiskData_entity_1 = require("./engsRiskData.entity");
const examRiskData_entity_1 = require("./examRiskData.entity");
const exam_entity_1 = require("./exam.entity");
class RiskFactorDataEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial === null || partial === void 0 ? void 0 : partial.homogeneousGroup) {
            this.homogeneousGroup = new homoGroup_entity_1.HomoGroupEntity(partial.homogeneousGroup);
        }
        this.getOrigin();
        if (partial.riskFactor) {
            this.riskFactor = new risk_entity_1.RiskFactorsEntity(partial.riskFactor);
            this.getProtocols();
            this.getMatrix();
        }
        this.progress = 0;
        this.isQuantity = false;
        if (this.json && typeof this.json === 'object') {
            const json = this.json;
            if (json.type === risk_data_json_types_1.QuantityTypeEnum.QUI)
                this.quiProb(json);
            if (json.type === risk_data_json_types_1.QuantityTypeEnum.NOISE)
                this.noiseProb(json);
            if (json.type === risk_data_json_types_1.QuantityTypeEnum.VFB)
                this.vibProb(json);
            if (json.type === risk_data_json_types_1.QuantityTypeEnum.VL)
                this.vibLProb(json);
            if (json.type === risk_data_json_types_1.QuantityTypeEnum.RADIATION)
                this.radProb(json);
            if (json.type === risk_data_json_types_1.QuantityTypeEnum.HEAT)
                this.heatProb(json);
        }
        this.getBaseExams();
        this.setRecMedExamData(partial);
    }
    getBaseExams() {
        var _a, _b;
        if (this.riskFactor && ((_a = this.riskFactor) === null || _a === void 0 ? void 0 : _a.examToRisk) && this.standardExams) {
            (_b = this.riskFactor) === null || _b === void 0 ? void 0 : _b.examToRisk.forEach((examData) => {
                if ((examData === null || examData === void 0 ? void 0 : examData.minRiskDegreeQuantity) && this.isQuantity && this.level < (examData === null || examData === void 0 ? void 0 : examData.minRiskDegreeQuantity))
                    return;
                if ((examData === null || examData === void 0 ? void 0 : examData.minRiskDegree) && (!this.isQuantity || !(examData === null || examData === void 0 ? void 0 : examData.minRiskDegreeQuantity)) && this.level < (examData === null || examData === void 0 ? void 0 : examData.minRiskDegree))
                    return;
                if (!this.examsToRiskFactorData)
                    this.examsToRiskFactorData = [];
                this.examsToRiskFactorData.push({
                    examId: examData.examId,
                    fromAge: examData.fromAge,
                    isAdmission: examData.isAdmission,
                    isChange: examData.isChange,
                    isDismissal: examData.isDismissal,
                    isFemale: examData.isFemale,
                    isMale: examData.isMale,
                    isPeriodic: examData.isPeriodic,
                    isReturn: examData.isReturn,
                    lowValidityInMonths: examData.lowValidityInMonths,
                    considerBetweenDays: examData.considerBetweenDays,
                    riskFactorDataId: this.id,
                    toAge: examData.toAge,
                    validityInMonths: examData.validityInMonths,
                    isStandard: true,
                    exam: examData === null || examData === void 0 ? void 0 : examData.exam,
                });
            });
        }
    }
    getProtocols() {
        var _a, _b;
        if (this.riskFactor && ((_a = this.riskFactor) === null || _a === void 0 ? void 0 : _a.protocolToRisk)) {
            (_b = this.riskFactor) === null || _b === void 0 ? void 0 : _b.protocolToRisk.forEach((protocolRisk) => {
                if ((protocolRisk === null || protocolRisk === void 0 ? void 0 : protocolRisk.minRiskDegreeQuantity) && this.isQuantity && this.level < (protocolRisk === null || protocolRisk === void 0 ? void 0 : protocolRisk.minRiskDegreeQuantity))
                    return;
                if ((protocolRisk === null || protocolRisk === void 0 ? void 0 : protocolRisk.minRiskDegree) && (!this.isQuantity || !(protocolRisk === null || protocolRisk === void 0 ? void 0 : protocolRisk.minRiskDegreeQuantity)) && this.level < (protocolRisk === null || protocolRisk === void 0 ? void 0 : protocolRisk.minRiskDegree))
                    return;
                if (!this.protocolsToRisk)
                    this.protocolsToRisk = [];
                this.protocolsToRisk.push(protocolRisk);
            });
        }
    }
    setRecMedExamData(partial) {
        if (!this.epis)
            this.epis = [];
        if (partial.epiToRiskFactorData) {
            this.epiToRiskFactorData = partial.epiToRiskFactorData.map((epiToRiskFactorData) => new epiRiskData_entity_1.EpiRiskDataEntity(epiToRiskFactorData));
            this.epis = this.epiToRiskFactorData.map((_a) => {
                var { epi } = _a, epiToRiskFactorData = __rest(_a, ["epi"]);
                return new epi_entity_1.EpiEntity(Object.assign(Object.assign({}, epi), { epiRiskData: epiToRiskFactorData }));
            });
        }
        if (!this.engs)
            this.engs = [];
        if (partial.engsToRiskFactorData) {
            this.engsToRiskFactorData = partial.engsToRiskFactorData.map((engsToRiskFactorData) => new engsRiskData_entity_1.EngsRiskDataEntity(engsToRiskFactorData));
            this.engs = this.engsToRiskFactorData.map((_a) => {
                var { recMed } = _a, engsToRiskFactorData = __rest(_a, ["recMed"]);
                return new recMed_entity_1.RecMedEntity(Object.assign(Object.assign({}, recMed), { engsRiskData: engsToRiskFactorData }));
            });
        }
        if (!this.exams)
            this.exams = [];
        if (partial.examsToRiskFactorData) {
            this.examsToRiskFactorData = partial.examsToRiskFactorData.map((examsToRiskFactorData) => new examRiskData_entity_1.ExamRiskDataEntity(examsToRiskFactorData));
            this.exams = this.examsToRiskFactorData.map((_a) => {
                var { exam } = _a, examsToRiskFactorData = __rest(_a, ["exam"]);
                return new exam_entity_1.ExamEntity(Object.assign(Object.assign({}, exam), { examsRiskData: examsToRiskFactorData }));
            });
        }
    }
    getMatrix() {
        var _a;
        if (this.riskFactor && ((_a = this.riskFactor) === null || _a === void 0 ? void 0 : _a.severity) && this.probability) {
            const matrix = (0, matriz_1.getMatrizRisk)(this.riskFactor.severity, this.probability);
            this.level = matrix.level || this.level || 0;
            this.ro = matrix.label;
            this.intervention = matrix.intervention;
        }
    }
    getOrigin() {
        if (this.homogeneousGroup) {
            if (this.homogeneousGroup.environment)
                this.origin = `${this.homogeneousGroup.environment.name}\n(${origin_risk_1.originRiskMap[this.homogeneousGroup.environment.type].name})`;
            if (this.homogeneousGroup.hierarchy && this.homogeneousGroup.hierarchy.name)
                this.origin = `${this.homogeneousGroup.hierarchy.name}\n(${origin_risk_1.originRiskMap[this.homogeneousGroup.hierarchy.type].name})`;
            if (this.homogeneousGroup.characterization)
                this.origin = `${this.homogeneousGroup.characterization.name}\n(${origin_risk_1.originRiskMap[this.homogeneousGroup.characterization.type].name})`;
            if (!this.homogeneousGroup.type)
                this.origin = `${this.homogeneousGroup.name}\n(GSE)`;
        }
    }
    quiProb(data) {
        const isNr15Teto = data.nr15lt && data.nr15lt.includes('T');
        const isStelTeto = data.stel && data.stel.includes('C');
        const isTwaTeto = data.twa && data.twa.includes('C');
        const isVmpTeto = data.vmp && data.vmp.includes('T');
        const nr15ltProb = this.percentageCheck(data.nr15ltValue, data.nr15lt, isNr15Teto ? 1 : 5);
        const stelProb = this.percentageCheck(data.stelValue, data.stel, isStelTeto ? 1 : 5);
        const twaProb = this.percentageCheck(data.twaValue, data.twa, isTwaTeto ? 1 : 5);
        const vmpProb = this.percentageCheck(data.vmpValue, data.vmp, 1);
        this.intensity = this.convertNum(data.nr15ltValue);
        if (nr15ltProb || stelProb || twaProb || vmpProb) {
            this.isQuantity = true;
            this.probability = nr15ltProb || stelProb || twaProb || vmpProb || undefined;
            this.json.isNr15Teto = isNr15Teto;
            this.json.isStelTeto = isStelTeto;
            this.json.isTwaTeto = isTwaTeto;
            this.json.isVmpTeto = isVmpTeto;
            this.json.nr15ltProb = nr15ltProb;
            this.json.stelProb = stelProb;
            this.json.twaProb = twaProb;
            this.json.vmpProb = vmpProb;
        }
    }
    noiseProb(data) {
        const limitQ3List = [75, 79, 82, 85, 115, 10000000];
        const limitQ5List = [64.4, 75, 80, 85, 115, 10000000];
        const ltcatq3 = this.valuesCheck(data.ltcatq3, limitQ3List);
        const ltcatq5 = this.valuesCheck(data.ltcatq5, limitQ5List);
        const nr15q5 = this.valuesCheck(data.nr15q5, limitQ5List);
        this.intensity = this.convertNum(data.nr15q5);
        if (ltcatq3 || ltcatq5 || nr15q5) {
            this.isQuantity = true;
            this.probability = Math.max(ltcatq3, ltcatq5, nr15q5) || undefined;
        }
    }
    vibProb(data) {
        const limitArenList = [0, 0.1, 0.5, 0.9, 1.101, 10000000000];
        const limitVdvrList = [0, 2.1, 9.1, 16.4, 21.01, 10000000000];
        const arenValue = this.valuesCheck(data === null || data === void 0 ? void 0 : data.aren, limitArenList);
        const vdvrValue = (data === null || data === void 0 ? void 0 : data.vdvr) ? this.valuesCheck(data === null || data === void 0 ? void 0 : data.vdvr, limitVdvrList) : 0;
        if (arenValue || vdvrValue) {
            const maxProb = Math.max(arenValue, vdvrValue);
            if (maxProb == arenValue)
                this.arenValue = this.convertNum(data.aren);
            if (maxProb == vdvrValue)
                this.vdvrValue = this.convertNum(data.vdvr);
            this.isQuantity = true;
            this.probAren = arenValue;
            this.probVdvr = vdvrValue;
            this.probability = Math.max(arenValue, vdvrValue) || undefined;
        }
    }
    vibLProb(data) {
        const limitArenList = [0, 0.5, 2.5, 3.5, 5.01, 10000000000];
        const arenValue = this.valuesCheck(data === null || data === void 0 ? void 0 : data.aren, limitArenList);
        this.arenValue = this.convertNum(data.aren);
        this.intensity = this.convertNum(data.aren);
        if (arenValue) {
            this.isQuantity = true;
            this.probAren = arenValue;
            this.probability = arenValue;
        }
    }
    radProb(data) {
        this.intensity = this.convertNum(data.doseFB);
        const doseFB = this.percentageCheck(data.doseFB, '20');
        const doseFBPublic = this.percentageCheck(data.doseFBPublic, '1');
        const doseEye = this.percentageCheck(data.doseEye, '20');
        const doseEyePublic = this.percentageCheck(data.doseEyePublic, '15');
        const doseSkin = this.percentageCheck(data.doseSkin, '500');
        const doseSkinPublic = this.percentageCheck(data.doseSkinPublic, '50');
        const doseHand = this.percentageCheck(data.doseHand, '500');
        const prob = Math.max(doseFB, doseFBPublic, doseEye, doseEyePublic, doseSkin, doseHand, doseSkinPublic);
        if (prob) {
            this.isQuantity = true;
            this.probability = prob;
            if (doseFB)
                this.json.doseFBProb = doseFB;
            if (doseFBPublic)
                this.json.doseFBPublicProb = doseFBPublic;
            if (doseEye)
                this.json.doseEyeProb = doseFB;
            if (doseEyePublic)
                this.json.doseEyePublicProb = doseEyePublic;
            if (doseSkin)
                this.json.doseSkinProb = doseSkin;
            if (doseSkinPublic)
                this.json.doseSkinPublicProb = doseSkinPublic;
            if (doseSkinPublic)
                this.json.doseSkinPublicProb = doseSkinPublic;
        }
    }
    heatProb(data) {
        const ibtug = Number((data === null || data === void 0 ? void 0 : data.ibtug) || 0) + Number((data === null || data === void 0 ? void 0 : data.clothesType) || 0);
        const mw = Number((data === null || data === void 0 ? void 0 : data.mw) || 0);
        const isAcclimatized = !!data.isAcclimatized;
        if (!mw || !ibtug)
            return 0;
        if (ibtug) {
            const ibtugLEO = this.mapCheck(mw, 100, 606, heatTable_constant_1.heatTableLEOConstant);
            const getProb = () => {
                const ibtugTETO = this.mapCheck(mw, 240, 607, heatTable_constant_1.heatTableTETOConstant);
                if (ibtugTETO.ibtug <= ibtug)
                    return 6;
                const ibtugNA = this.mapCheck(mw, 100, 602, heatTable_constant_1.heatTableNAConstant);
                if (!isAcclimatized) {
                    const ibtugNAList = [ibtugNA.ibtug - 2, ibtugNA.ibtug - 1.5, ibtugNA.ibtug - 1, ibtugNA.ibtug - 0.5, ibtugNA.ibtug, 10000];
                    return this.valuesCheck(String(ibtug), ibtugNAList, 5);
                }
                const ibtugLII = this.mapCheck(mw, 100, 606, heatTable_constant_1.heatTableLIIConstant);
                if (ibtug <= ibtugNA.ibtug)
                    return 1;
                if (ibtug > ibtugNA.ibtug && ibtug <= ibtugLII.ibtugLII)
                    return 2;
                if (ibtug > ibtugLEO.ibtug)
                    return 5;
                if (ibtug >= ibtugLII.ibtugLSI && ibtug <= ibtugLEO.ibtug)
                    return 4;
                if (ibtug > ibtugLII.ibtugLII && ibtug < ibtugLII.ibtugLSI)
                    return 3;
            };
            const prob = getProb();
            if (prob) {
                this.isQuantity = true;
                this.ibtugLEO = ibtugLEO.ibtug;
                this.ibtug = ibtug;
                this.probability = prob;
                this.intensity = ibtug;
            }
        }
    }
    percentageCheck(value, limit, maxLimitMultiplier) {
        if (!value || !limit)
            return 0;
        value = value.replace(/[^0-9.]/g, '');
        limit = limit.replace(/[^0-9.]/g, '');
        const stage = Number(value) / Number(limit);
        if (stage < 0.1)
            return 1;
        if (stage < 0.25)
            return 2;
        if (stage < 0.5)
            return 3;
        if (stage < 1)
            return 4;
        if (maxLimitMultiplier && stage > maxLimitMultiplier)
            return 6;
        return 5;
    }
    valuesCheck(value, limits, highValue) {
        if (!value || !limits.length)
            return 0;
        value = value.replace(/[^0-9.]/g, '');
        let returnValue = 0;
        for (let index = 0; index < limits.length; index++) {
            const actualValue = Number(value);
            if (actualValue < limits[index]) {
                returnValue = index + 1;
                break;
            }
        }
        return highValue && returnValue > highValue ? highValue : returnValue;
    }
    mapCheck(mw, min, max, map) {
        let valueMap;
        for (let index = 0; index < 100; index++) {
            const key = mw + index;
            if (key > max) {
                valueMap = map[max];
                break;
            }
            if (key < min) {
                valueMap = map[min];
                break;
            }
            const value = map[key];
            if (value) {
                valueMap = value;
                break;
            }
        }
        return valueMap;
    }
    convertNum(value) {
        return Number(value);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, probability: { required: true, type: () => Number }, probabilityAfter: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, deleted_at: { required: true, type: () => Date, nullable: true }, hierarchy: { required: false, type: () => require("../../company/entities/hierarchy.entity").HierarchyEntity }, hierarchyId: { required: true, type: () => String }, homogeneousGroup: { required: false, type: () => require("../../company/entities/homoGroup.entity").HomoGroupEntity }, homogeneousGroupId: { required: true, type: () => String }, riskFactor: { required: false, type: () => require("./risk.entity").RiskFactorsEntity }, riskId: { required: true, type: () => String }, riskFactorGroupDataId: { required: true, type: () => String }, recs: { required: false, type: () => [require("./recMed.entity").RecMedEntity] }, engs: { required: false, type: () => [require("./recMed.entity").RecMedEntity] }, adms: { required: false, type: () => [require("./recMed.entity").RecMedEntity] }, generateSources: { required: false, type: () => [require("./generateSource.entity").GenerateSourceEntity] }, epis: { required: false, type: () => [require("./epi.entity").EpiEntity] }, exams: { required: false, type: () => [require("./exam.entity").ExamEntity] }, dataRecs: { required: false, type: () => [require("./riskDataRec.entity").RiskDataRecEntity] }, level: { required: true, type: () => Number }, json: { required: true, type: () => Object }, isQuantity: { required: false, type: () => Boolean }, ibtugLEO: { required: false, type: () => Number }, ibtug: { required: false, type: () => Number }, probAren: { required: false, type: () => Number }, probVdvr: { required: false, type: () => Number }, origin: { required: false, type: () => String }, ro: { required: false, type: () => String }, intensity: { required: false, type: () => Number }, vdvrValue: { required: false, type: () => Number }, arenValue: { required: false, type: () => Number }, prioritization: { required: false, type: () => Number }, intervention: { required: false, type: () => String }, progress: { required: false, type: () => Number }, epiToRiskFactorData: { required: false, type: () => [require("./epiRiskData.entity").EpiRiskDataEntity] }, engsToRiskFactorData: { required: false, type: () => [require("./engsRiskData.entity").EngsRiskDataEntity] }, examsToRiskFactorData: { required: false, type: () => [require("./examRiskData.entity").ExamRiskDataEntity] }, standardExams: { required: true, type: () => Boolean }, endDate: { required: true, type: () => Date }, startDate: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, protocolsToRisk: { required: true, type: () => [require("./protocol.entity").ProtocolToRiskEntity] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the Company' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The probability of the risk data' }),
    __metadata("design:type", Number)
], RiskFactorDataEntity.prototype, "probability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The probability of the risk data' }),
    __metadata("design:type", Number)
], RiskFactorDataEntity.prototype, "probabilityAfter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company id related to the risk data' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the risk data' }),
    __metadata("design:type", Date)
], RiskFactorDataEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The deleted date of data' }),
    __metadata("design:type", Date)
], RiskFactorDataEntity.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The hierarchy data' }),
    __metadata("design:type", hierarchy_entity_1.HierarchyEntity)
], RiskFactorDataEntity.prototype, "hierarchy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The hierarchy id' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "hierarchyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The homogeneous group data' }),
    __metadata("design:type", homoGroup_entity_1.HomoGroupEntity)
], RiskFactorDataEntity.prototype, "homogeneousGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The homogeneous group id' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "homogeneousGroupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The risk factor data' }),
    __metadata("design:type", risk_entity_1.RiskFactorsEntity)
], RiskFactorDataEntity.prototype, "riskFactor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The risk id' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "riskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The risk group data id' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "riskFactorGroupDataId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with recommendations data',
    }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "recs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with measure controls data',
    }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "engs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with measure controls data',
    }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "adms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The array with generate source data' }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "generateSources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The array with generate source data' }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "epis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The array with exam data' }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "exams", void 0);
exports.RiskFactorDataEntity = RiskFactorDataEntity;
//# sourceMappingURL=riskData.entity.js.map