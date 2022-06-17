"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyPrioritizationConverter = void 0;
const client_1 = require("@prisma/client");
const matrizRisk_constant_1 = require("../../../../constants/matrizRisk.constant");
const palette_1 = require("../../../../../../shared/constants/palette");
const removeDuplicate_1 = require("../../../../../../shared/utils/removeDuplicate");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const matriz_1 = require("../../../matriz");
const first_constant_1 = require("../riskInventory/parts/first/first.constant");
const hierarchyPrioritizationConverter = (riskGroup, hierarchyData) => {
    const hierarchyType = client_1.HierarchyEnum.SECTOR;
    const isByGroup = true;
    const warnLevelStart = 4;
    const allHierarchyRecord = {};
    const allRiskRecord = {};
    const HomoPositionMap = new Map();
    (function getAllHierarchyByType() {
        hierarchyData.forEach((hierarchiesData) => {
            const hierarchy = hierarchiesData.org.find((hierarchyData) => {
                return hierarchyData.typeEnum === hierarchyType;
            });
            if (hierarchy) {
                const hierarchyMap = allHierarchyRecord[hierarchy.id] || {
                    homogeneousGroupIds: [],
                };
                allHierarchyRecord[hierarchy.id] = {
                    homogeneousGroupIds: (0, removeDuplicate_1.removeDuplicate)([
                        ...hierarchyMap.homogeneousGroupIds,
                        ...hierarchiesData.allHomogeneousGroupIds,
                    ], { simpleCompare: true }),
                    name: hierarchy.name,
                };
            }
        });
    })();
    (function getAllRiskFactors() {
        riskGroup.data.forEach((riskData) => {
            riskData.homogeneousGroupId;
            const hasRisk = allRiskRecord[riskData.riskId] || {
                homogeneousGroupIds: [],
                riskDegree: '',
                riskDegreeLevel: 0,
            };
            const severity = riskData.riskFactor.severity;
            const probability = riskData.probability;
            if (!hasRisk.riskDegree) {
                const riskDegree = (0, matriz_1.getMatrizRisk)(severity, probability);
                hasRisk.riskDegree = riskDegree.short;
                hasRisk.riskDegreeLevel = riskDegree.level;
            }
            allRiskRecord[riskData.riskId] = Object.assign(Object.assign({}, hasRisk), { name: riskData.riskFactor.name, homogeneousGroupIds: [
                    ...hasRisk.homogeneousGroupIds,
                    riskData.homogeneousGroupId,
                ] });
        });
    })();
    const allRisks = Object.values(allRiskRecord);
    const allHierarchy = Object.values(allHierarchyRecord);
    const isRiskLengthGreater = allRisks.length > allHierarchy.length;
    const header = isRiskLengthGreater
        ? allHierarchy
        : allRisks;
    const body = isRiskLengthGreater
        ? allRisks
        : allHierarchy;
    function setHeaderTable() {
        const row = header
            .sort((a, b) => (0, string_sort_1.sortString)(a, b, 'name'))
            .map((risk, index) => {
            risk.homogeneousGroupIds.forEach((homogeneousGroupId) => {
                const homoPosition = HomoPositionMap.get(homogeneousGroupId) || {
                    data: [],
                };
                const isDataRisk = 'riskDegree' in risk && risk.riskDegree;
                const isDataRiskLevel = 'riskDegreeLevel' in risk && risk.riskDegreeLevel;
                HomoPositionMap.set(homogeneousGroupId, {
                    data: [
                        ...homoPosition.data,
                        {
                            position: index + 1,
                            riskDegree: isDataRisk || '',
                            riskDegreeLevel: isDataRiskLevel || 0,
                        },
                    ],
                });
            });
            return {
                text: risk.name,
                font: header.length >= 20 ? 8 : header.length >= 10 ? 10 : 12,
            };
        });
        row.unshift({
            text: first_constant_1.hierarchyMap[hierarchyType].text,
            position: 0,
            textDirection: undefined,
            size: row.length < 6 ? 1 : Math.ceil(row.length / 6),
        });
        return row;
    }
    const headerData = setHeaderTable();
    const columnsLength = headerData.length;
    function setBodyTable() {
        return body
            .sort((a, b) => (0, string_sort_1.sortString)(a, b, 'name'))
            .map((hierarchy) => {
            const row = Array.from({ length: columnsLength }).map(() => ({}));
            row[0] = {
                text: hierarchy.name,
                shading: { fill: palette_1.palette.table.header.string },
            };
            const isDataRisk = 'riskDegree' in hierarchy && hierarchy.riskDegree;
            const isDataRiskLevel = 'riskDegree' in hierarchy && hierarchy.riskDegreeLevel;
            hierarchy.homogeneousGroupIds.forEach((homogeneousGroupId) => {
                const homoPosition = HomoPositionMap.get(homogeneousGroupId);
                if (homoPosition) {
                    homoPosition.data.forEach(({ position, riskDegree, riskDegreeLevel }) => {
                        row[position] = {
                            text: riskDegree || isDataRisk,
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