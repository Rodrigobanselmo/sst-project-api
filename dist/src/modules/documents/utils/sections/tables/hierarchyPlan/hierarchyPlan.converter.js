"use strict";
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
exports.hierarchyPlanConverter = void 0;
const number_sort_1 = require("../../../../../../shared/utils/sorts/number.sort");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const hierarchyPlan_constant_1 = require("./hierarchyPlan.constant");
const hierarchyPlanConverter = (hierarchyData, homoGroupTree) => {
    const allHierarchyPlan = {};
    const hierarchyColumns = {};
    (function mapAllHierarchyPlan() {
        hierarchyData.forEach((hierarchiesData) => {
            hierarchiesData.org.forEach((hierarchyData) => {
                hierarchyData.homogeneousGroupIds.forEach((homogeneousGroupId) => {
                    if (!allHierarchyPlan[homogeneousGroupId])
                        allHierarchyPlan[homogeneousGroupId] = {};
                    const loop = (allHierarchyPlanLoop, index) => {
                        const hierarchyId = hierarchiesData.org[index].id;
                        const hierarchyName = hierarchiesData.org[index].name;
                        const hierarchyType = hierarchiesData.org[index].typeEnum;
                        hierarchyColumns[hierarchyType] = 0;
                        if (!allHierarchyPlanLoop[hierarchyId])
                            allHierarchyPlanLoop[hierarchyId] = {
                                type: hierarchyType,
                                data: {},
                                name: hierarchyName,
                            };
                        if (hierarchiesData.org[index + 1]) {
                            loop(allHierarchyPlanLoop[hierarchyId].data, index + 1);
                        }
                    };
                    loop(allHierarchyPlan[homogeneousGroupId], 0);
                });
            });
        });
    })();
    const mockedColumns = [
        hierarchyPlan_constant_1.HierarchyPlanMap[hierarchyPlan_constant_1.HierarchyPlanColumnEnum.GSE],
        hierarchyPlan_constant_1.HierarchyPlanMap[hierarchyPlan_constant_1.HierarchyPlanColumnEnum.DESCRIPTION],
    ].map((_a) => {
        var column = __rest(_a, []);
        delete column.position;
        return column;
    });
    function setHeaderTable() {
        const row = [...mockedColumns];
        const headerTable = Object.keys(hierarchyColumns)
            .map((type) => {
            return Object.assign({ type }, hierarchyPlan_constant_1.HierarchyPlanMap[type]);
        })
            .sort((a, b) => (0, number_sort_1.sortNumber)(a, b, 'position'))
            .map((_a, index) => {
            var { type } = _a, column = __rest(_a, ["type"]);
            hierarchyColumns[type] = index + mockedColumns.length;
            delete column.position;
            return column;
        });
        row.push(...headerTable);
        return row;
    }
    const headerData = setHeaderTable();
    const columnsLength = headerData.length;
    function setBodyTable() {
        let rowsPosition = 0;
        const rows = [];
        const generateRow = () => Array.from({ length: columnsLength }).map(() => ({}));
        Object.entries(allHierarchyPlan)
            .sort(([a], [b]) => (0, string_sort_1.sortString)(a, b))
            .forEach(([homogeneousGroupId, firstHierarchyPlan]) => {
            const row = generateRow();
            const firstPosition = rowsPosition;
            row[0] = { text: homoGroupTree[homogeneousGroupId].name };
            row[1] = { text: homoGroupTree[homogeneousGroupId].description };
            rows[rowsPosition] = row;
            const loop = (map) => {
                const hierarchyArray = Object.entries(map);
                const firstPosition = rowsPosition;
                let totalRowsToSpan = 0;
                let indexRowSpan = 0;
                hierarchyArray.forEach(([, hierarchyData]) => {
                    const hierarchyColumnTypePosition = hierarchyColumns[hierarchyData.type];
                    indexRowSpan = hierarchyColumnTypePosition;
                    if (!rows[rowsPosition])
                        rows[rowsPosition] = generateRow();
                    rows[rowsPosition][hierarchyColumnTypePosition] = {
                        text: hierarchyData.name,
                    };
                    const someRowsToSpan = loop(hierarchyData.data);
                    rowsPosition++;
                    totalRowsToSpan = totalRowsToSpan + someRowsToSpan;
                });
                if (indexRowSpan)
                    rows[firstPosition][indexRowSpan] = Object.assign(Object.assign({}, rows[firstPosition][indexRowSpan]), { rowSpan: totalRowsToSpan });
                return totalRowsToSpan;
            };
            const rowsToSpan = loop(firstHierarchyPlan);
            rows[firstPosition][0] = Object.assign(Object.assign({}, rows[firstPosition][0]), { rowSpan: rowsToSpan });
            return row;
        });
        return rows;
    }
    const bodyData = setBodyTable();
    return { bodyData, headerData };
};
exports.hierarchyPlanConverter = hierarchyPlanConverter;
//# sourceMappingURL=hierarchyPlan.converter.js.map