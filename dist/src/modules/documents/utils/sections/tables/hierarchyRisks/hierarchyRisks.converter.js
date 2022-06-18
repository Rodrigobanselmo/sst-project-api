"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyRisksConverter = void 0;
const client_1 = require("@prisma/client");
const palette_1 = require("../../../../../../shared/constants/palette");
const removeDuplicate_1 = require("../../../../../../shared/utils/removeDuplicate");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const first_constant_1 = require("../riskInventory/parts/first/first.constant");
const hierarchyRisksConverter = (riskGroup, hierarchyData, { hierarchyType = client_1.HierarchyEnum.SECTOR }) => {
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
            };
            allRiskRecord[riskData.riskId] = {
                name: riskData.riskFactor.name,
                homogeneousGroupIds: [
                    ...hasRisk.homogeneousGroupIds,
                    riskData.homogeneousGroupId,
                ],
            };
        });
    })();
    const allRisks = Object.values(allRiskRecord);
    const allHierarchy = Object.values(allHierarchyRecord);
    const isLengthGreaterThan50 = allRisks.length > 50 && allHierarchy.length > 50;
    const isRiskLengthGreater = allRisks.length > allHierarchy.length;
    const shouldRiskBeInRows = isLengthGreaterThan50 || isRiskLengthGreater;
    const header = shouldRiskBeInRows ? allHierarchy : allRisks;
    const body = shouldRiskBeInRows ? allRisks : allHierarchy;
    function setHeaderTable() {
        const row = header
            .sort((a, b) => (0, string_sort_1.sortString)(a, b, 'name'))
            .map((risk, index) => {
            risk.homogeneousGroupIds.forEach((homogeneousGroupId) => {
                const homoPosition = HomoPositionMap.get(homogeneousGroupId) || {
                    position: [],
                };
                HomoPositionMap.set(homogeneousGroupId, {
                    position: [...homoPosition.position, index + 1],
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
            hierarchy.homogeneousGroupIds.forEach((homogeneousGroupId) => {
                const homoPosition = HomoPositionMap.get(homogeneousGroupId);
                if (homoPosition) {
                    homoPosition.position.forEach((position) => {
                        row[position] = { text: 'X' };
                    });
                }
            });
            return row;
        });
    }
    const bodyData = setBodyTable();
    return { bodyData, headerData };
};
exports.hierarchyRisksConverter = hierarchyRisksConverter;
//# sourceMappingURL=hierarchyRisks.converter.js.map