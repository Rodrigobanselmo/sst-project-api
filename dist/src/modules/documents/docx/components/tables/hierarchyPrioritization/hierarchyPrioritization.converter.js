"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyPrioritizationConverter = void 0;
const number_sort_1 = require("./../../../../../../shared/utils/sorts/number.sort");
const risks_constant_1 = require("./../../../../constants/risks.constant");
const origin_risk_1 = require("./../../../../../../shared/constants/maps/origin-risk");
const client_1 = require("@prisma/client");
const palette_1 = require("../../../../../../shared/constants/palette");
const removeDuplicate_1 = require("../../../../../../shared/utils/removeDuplicate");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const matriz_1 = require("../../../../../../shared/utils/matriz");
const first_constant_1 = require("../appr/parts/first/first.constant");
const styles_1 = require("../../../base/config/styles");
const hierarchyPrioritizationConverter = (riskGroup, hierarchyData, hierarchyTree, { hierarchyType = client_1.HierarchyEnum.SECTOR, isByGroup = false, homoType }) => {
    const warnLevelStart = 4;
    const allRiskRecord = {};
    const allHierarchyRecord = {};
    const HomoPositionMap = new Map();
    function getAllHierarchyByType() {
        hierarchyData.forEach((hierarchiesData) => {
            const hierarchy = hierarchiesData.org.find((hierarchyData) => {
                return hierarchyData.typeEnum === hierarchyType;
            });
            if (hierarchy) {
                const hierarchyMap = allHierarchyRecord[hierarchy.id] || {
                    homogeneousGroupIds: [],
                };
                allHierarchyRecord[hierarchy.id] = {
                    homogeneousGroupIds: (0, removeDuplicate_1.removeDuplicate)([...hierarchyMap.homogeneousGroupIds, ...hierarchiesData.allHomogeneousGroupIds], { simpleCompare: true }),
                    name: hierarchy.name,
                };
            }
        });
        return allHierarchyRecord;
    }
    function getAllHomoGroups() {
        riskGroup.data.forEach((riskData) => {
            var _a;
            if (!homoType && riskData.homogeneousGroup.type)
                return;
            if (homoType && !Array.isArray(homoType) && riskData.homogeneousGroup.type !== homoType)
                return;
            if (homoType && Array.isArray(homoType) && !homoType.includes(riskData.homogeneousGroup.type))
                return;
            const homoId = riskData.homogeneousGroup.id;
            let name = riskData.homogeneousGroup.name;
            if (riskData.homogeneousGroup.environment) {
                name = `${(_a = riskData.homogeneousGroup.environment) === null || _a === void 0 ? void 0 : _a.name}\n(${origin_risk_1.originRiskMap[riskData.homogeneousGroup.environment.type].name})`;
            }
            if (riskData.homogeneousGroup.characterization)
                name = `${riskData.homogeneousGroup.characterization.name}\n(${origin_risk_1.originRiskMap[riskData.homogeneousGroup.characterization.type].name})`;
            if (riskData.homogeneousGroup.type == client_1.HomoTypeEnum.HIERARCHY) {
                const hierarchy = hierarchyTree[homoId];
                if (hierarchy)
                    name = `${hierarchy.name}\n(${origin_risk_1.originRiskMap[hierarchy.type].name})`;
            }
            const hierarchyMap = allHierarchyRecord[homoId] || {
                homogeneousGroupIds: [homoId],
            };
            allHierarchyRecord[homoId] = Object.assign(Object.assign({}, hierarchyMap), { name });
        });
    }
    !isByGroup ? getAllHierarchyByType() : getAllHomoGroups();
    (function getAllRiskFactors() {
        riskGroup.data.forEach((riskData) => {
            var _a, _b;
            const hasRisk = allRiskRecord[riskData.riskId] || {
                homogeneousGroupIds: [],
            };
            const dataRisk = {};
            const severity = riskData.riskFactor.severity;
            const probability = riskData.probability;
            const riskDegree = (0, matriz_1.getMatrizRisk)(severity, probability);
            dataRisk.riskDegree = riskDegree.short;
            dataRisk.riskDegreeLevel = riskDegree.level;
            dataRisk.isQuantity = riskData.isQuantity;
            dataRisk.id = riskData.homogeneousGroupId;
            allRiskRecord[riskData.riskId] = Object.assign(Object.assign({}, hasRisk), { name: `(${(_a = riskData.riskFactor) === null || _a === void 0 ? void 0 : _a.type}) ${riskData.riskFactor.name}`, type: (_b = riskData.riskFactor) === null || _b === void 0 ? void 0 : _b.type, homogeneousGroupIds: [...hasRisk.homogeneousGroupIds, dataRisk] });
        });
    })();
    const allRisks = Object.values(allRiskRecord);
    const allHierarchy = Object.values(allHierarchyRecord);
    const isLengthGreaterThan50 = allHierarchy.length > 50;
    const shouldRiskBeInRows = isLengthGreaterThan50;
    const header = shouldRiskBeInRows ? allHierarchy : allRisks;
    const body = shouldRiskBeInRows ? allRisks : allHierarchy;
    function setHeaderTable() {
        const row = header
            .sort((a, b) => (0, string_sort_1.sortString)(a, b, 'name'))
            .sort((a, b) => (0, number_sort_1.sortNumber)(risks_constant_1.riskMap[a.type], risks_constant_1.riskMap[b.type], 'order'))
            .map((risk, index) => {
            risk.homogeneousGroupIds.forEach((homogeneousGroup) => {
                const homogeneousGroupId = homogeneousGroup.id;
                const homoPosition = HomoPositionMap.get(homogeneousGroupId) || {
                    data: [],
                };
                const isQuantity = 'isQuantity' in homogeneousGroup && !!homogeneousGroup.isQuantity;
                const isDataRisk = 'riskDegree' in homogeneousGroup && homogeneousGroup.riskDegree;
                const isDataRiskLevel = 'riskDegreeLevel' in homogeneousGroup && homogeneousGroup.riskDegreeLevel;
                HomoPositionMap.set(homogeneousGroupId, {
                    data: [
                        ...homoPosition.data,
                        {
                            position: index + 1,
                            riskDegree: isDataRisk || '',
                            riskDegreeLevel: isDataRiskLevel || 0,
                            isQuantity,
                        },
                    ],
                });
            });
            return {
                text: risk.name,
                font: header.length >= 20 ? 8 : header.length >= 10 ? 10 : 12,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
        });
        const groupName = () => {
            if (!homoType)
                return 'GSE';
            if (homoType === 'HIERARCHY')
                return 'Nível Hierarquico';
            if (homoType === 'ENVIRONMENT')
                return 'Ambiente';
            return 'Mão de Obra';
        };
        row.unshift({
            text: isByGroup ? groupName() : first_constant_1.hierarchyMap[hierarchyType].text,
            position: 0,
            textDirection: undefined,
            size: row.length < 6 ? 1 : Math.ceil(row.length / 6),
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        });
        return row;
    }
    const headerData = setHeaderTable();
    const columnsLength = headerData.length;
    function setBodyTable() {
        return body
            .sort((a, b) => (0, string_sort_1.sortString)(a, b, 'name'))
            .sort((a, b) => (0, number_sort_1.sortNumber)(risks_constant_1.riskMap[a.type], risks_constant_1.riskMap[b.type], 'order'))
            .map((hierarchy) => {
            const row = Array.from({ length: columnsLength }).map(() => ({
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            }));
            row[0] = {
                text: hierarchy.name,
                shading: { fill: palette_1.palette.table.header.string },
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            hierarchy.homogeneousGroupIds.forEach((homogeneousGroup) => {
                const isString = typeof homogeneousGroup === 'string';
                const homogeneousGroupId = isString ? homogeneousGroup : homogeneousGroup.id;
                const isDataRisk = !isString && 'riskDegree' in homogeneousGroup && homogeneousGroup.riskDegree;
                const isDataRiskLevel = !isString && 'riskDegree' in homogeneousGroup && homogeneousGroup.riskDegreeLevel;
                const isDataRiskQuantity = !isString && 'isQuantity' in homogeneousGroup && !!homogeneousGroup.isQuantity;
                const homoPosition = HomoPositionMap.get(homogeneousGroupId);
                if (homoPosition) {
                    homoPosition.data.forEach(({ position, riskDegree, riskDegreeLevel, isQuantity }) => {
                        row[position] = {
                            text: riskDegree || isDataRisk,
                            shaded: isQuantity || isDataRiskQuantity,
                            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
                            attention: (riskDegreeLevel || isDataRiskLevel) >= warnLevelStart,
                        };
                    });
                }
            });
            return row;
        });
    }
    const bodyData = setBodyTable();
    return { bodyData, headerData };
};
exports.hierarchyPrioritizationConverter = hierarchyPrioritizationConverter;
//# sourceMappingURL=hierarchyPrioritization.converter.js.map