"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentConverter = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const docx_1 = require("docx");
const body_1 = require("../../elements/body");
const first_constant_1 = require("./first.constant");
const documentConverter = (riskFactorGroupData, homoGroupTree, hierarchy, isByGroup) => {
    const rows = [];
    const homogeneousGroups = [];
    const environments = [];
    rows.push(first_constant_1.firstRiskInventoryHeader.map((data) => (Object.assign(Object.assign({}, data), { size: 4, borders: body_1.borderNoneStyle }))));
    const docData = [];
    docData[first_constant_1.FirstRiskInventoryColumnEnum.SOURCE] = riskFactorGroupData.source || '';
    docData[first_constant_1.FirstRiskInventoryColumnEnum.REVIEW] = riskFactorGroupData.revisionBy || '';
    docData[first_constant_1.FirstRiskInventoryColumnEnum.ELABORATION_BY] = riskFactorGroupData.elaboratedBy || '';
    docData[first_constant_1.FirstRiskInventoryColumnEnum.APPROVE_BY] = riskFactorGroupData.approvedBy || '';
    docData[first_constant_1.FirstRiskInventoryColumnEnum.DATA] = (0, dayjs_1.default)(riskFactorGroupData.visitDate).format('DD/MM/YYYY') || '';
    docData[first_constant_1.FirstRiskInventoryColumnEnum.UNIT] = hierarchy.workspace || '';
    rows.push(docData.map((data) => ({
        text: data,
        size: 26,
        borders: body_1.borderNoneStyle,
    })));
    rows.push(docData.map((_, index) => {
        var _a, _b;
        if (!hierarchy.org[index])
            return { text: '', size: 10, borders: body_1.borderNoneStyle };
        if ((_a = hierarchy.org[index]) === null || _a === void 0 ? void 0 : _a.homogeneousGroup) {
            homogeneousGroups.push(hierarchy.org[index].homogeneousGroup);
        }
        if ((_b = hierarchy.org[index]) === null || _b === void 0 ? void 0 : _b.environments) {
            environments.push(hierarchy.org[index].environments);
        }
        const cell = {
            text: hierarchy.org[index].type,
            size: 10,
            bold: true,
            borders: body_1.borderNoneStyle,
            alignment: docx_1.AlignmentType.RIGHT,
        };
        if (isByGroup)
            cell.text = '';
        return cell;
    }));
    rows.push(docData.map((_, index) => {
        if (isByGroup)
            return { text: '', size: 20, borders: body_1.borderNoneStyle };
        if (!hierarchy.org[index])
            return { text: '', size: 20, borders: body_1.borderNoneStyle };
        return {
            text: hierarchy.org[index].name,
            size: 20,
            borders: body_1.borderNoneStyle,
        };
    }));
    rows.push(docData.map((_, index) => {
        const last = 0 === index;
        const penultimate = 1 === index;
        const lastPenultimate = 2 === index;
        if (last)
            return {
                title: `GSE:`,
                text: homogeneousGroups.length ? homogeneousGroups.filter((homo) => homo).join(', ') : ' --',
                size: 30,
                borders: body_1.borderNoneStyle,
            };
        if (penultimate)
            return {
                title: `Ambientes:`,
                text: environments.length ? environments.filter((homo) => homo).join(', ') : ' --',
                size: 30,
                borders: body_1.borderNoneStyle,
            };
        if (lastPenultimate)
            return {
                title: `Quantidade de Funcionários Expostos:`,
                text: String(hierarchy.employeesLength),
                size: 30,
                borders: body_1.borderNoneStyle,
            };
        return { text: '', size: 30, borders: body_1.borderNoneStyle };
    }));
    const rowInverse = [];
    rows.forEach((row, index) => {
        row.forEach((cell, cellIndex) => {
            rowInverse[cellIndex] = rowInverse[cellIndex] || [];
            rowInverse[cellIndex][index] = cell;
        });
    });
    return rowInverse;
};
exports.documentConverter = documentConverter;
//# sourceMappingURL=first.converter.js.map