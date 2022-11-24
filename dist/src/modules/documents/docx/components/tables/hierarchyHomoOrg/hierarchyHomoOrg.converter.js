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
const origin_risk_1 = require("./../../../../../../shared/constants/maps/origin-risk");
const hierarchy_list_1 = require("../../../../../../shared/constants/lists/hierarchy.list");
const palette_1 = require("../../../../../../shared/constants/palette");
const number_sort_1 = require("../../../../../../shared/utils/sorts/number.sort");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const body_1 = require("./elements/body");
const hierarchyHomoOrg_constant_1 = require("./hierarchyHomoOrg.constant");
const styles_1 = require("../../../base/config/styles");
const hierarchyEmptyId = '0';
const hierarchyPlanConverter = (hierarchyData, homoGroupTree, { showDescription, showHomogeneous, showHomogeneousDescription, type, groupIdFilter } = {
    showHomogeneous: false,
    showHomogeneousDescription: false,
    showDescription: true,
    type: undefined,
    groupIdFilter: undefined,
}) => {
    let hasAtLeastOneDescription = false;
    const allHierarchyPlan = {};
    const hierarchyColumns = {};
    (function mapAllHierarchyPlan() {
        hierarchyData.forEach((hierarchiesData) => {
            const highParent = hierarchiesData.org[0];
            const org = [...hierarchy_list_1.hierarchyList, 'EMPLOYEE'].map((orgType) => {
                const hierarchyData = hierarchiesData.org.find((org) => org.typeEnum === orgType);
                if (hierarchiesData.descRh)
                    hasAtLeastOneDescription = true;
                if (!hierarchyData) {
                    return {
                        type: orgType,
                        typeEnum: orgType,
                        name: body_1.emptyCellName,
                        id: hierarchyEmptyId,
                        homogeneousGroupIds: [],
                        homogeneousGroup: '',
                        employeesLength: hierarchiesData.employeesLength,
                        description: hierarchiesData.descRh,
                    };
                }
                return Object.assign(Object.assign(Object.assign({}, hierarchyData), (showHomogeneous ? {} : { homogeneousGroupIds: [highParent.id] })), { employeesLength: hierarchiesData.employeesLength, description: hierarchiesData.descRh });
            });
            hierarchiesData.org.forEach((hierarchyData) => {
                (showHomogeneous ? hierarchyData.homogeneousGroupIds : [highParent.id]).forEach((homogeneousGroupId) => {
                    if (!allHierarchyPlan[homogeneousGroupId])
                        allHierarchyPlan[homogeneousGroupId] = {};
                    const loop = (allHierarchyPlanLoop, index) => {
                        var _a, _b, _c;
                        const hierarchyId = org[index].id;
                        const hierarchyName = (_a = org[index]) === null || _a === void 0 ? void 0 : _a.name;
                        const hierarchyType = org[index].typeEnum;
                        const hierarchyEmployees = ((_b = org[index]) === null || _b === void 0 ? void 0 : _b.employeesLength) || 0;
                        const hierarchyDesc = ((_c = org[index]) === null || _c === void 0 ? void 0 : _c.description) || 0;
                        if (hierarchyId !== hierarchyEmptyId)
                            hierarchyColumns[hierarchyType] = 0;
                        if (!allHierarchyPlanLoop[hierarchyId])
                            allHierarchyPlanLoop[hierarchyId] = {
                                type: hierarchyType,
                                data: {},
                                name: hierarchyName,
                                numEmployees: String(hierarchyEmployees),
                                description: hierarchyDesc || '',
                            };
                        if (org[index + 1]) {
                            loop(allHierarchyPlanLoop[hierarchyId].data, index + 1);
                        }
                    };
                    loop(allHierarchyPlan[homogeneousGroupId], 0);
                });
            });
        });
    })();
    const mockedColumns = [hierarchyHomoOrg_constant_1.HierarchyPlanMap[hierarchyHomoOrg_constant_1.HierarchyPlanColumnEnum.GSE], hierarchyHomoOrg_constant_1.HierarchyPlanMap[hierarchyHomoOrg_constant_1.HierarchyPlanColumnEnum.DESCRIPTION]].map((_a) => {
        var column = __rest(_a, []);
        delete column.position;
        return column;
    });
    if (showHomogeneous && !showHomogeneousDescription)
        mockedColumns.slice(0, 1);
    function setHeaderTable() {
        const row = showHomogeneous ? [...mockedColumns] : [];
        const headerTable = Object.keys(hierarchyColumns)
            .map((type) => {
            return Object.assign({ type }, hierarchyHomoOrg_constant_1.HierarchyPlanMap[type]);
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
            .sort(([a, c], [b, d]) => (showHomogeneous ? (0, string_sort_1.sortString)(homoGroupTree[a], homoGroupTree[b], 'name') : (0, string_sort_1.sortString)(c[0], d[0], 'name')))
            .forEach(([homogeneousGroupId, firstHierarchyPlan]) => {
            const homo = homoGroupTree[homogeneousGroupId];
            let name = homo ? homo.name : '';
            if (showHomogeneous) {
                if (!homo)
                    return;
                if (!type && homo && homo.type)
                    return;
                if (type && !Array.isArray(type) && homo.type !== type)
                    return;
                if (type && Array.isArray(type) && !type.includes(homo.type))
                    return;
                if (groupIdFilter && homo.id != groupIdFilter)
                    return;
                if (homo.environment) {
                    name = `${homo.environment.name}\n(${origin_risk_1.originRiskMap[homo.environment.type].name})`;
                }
                if (homo.characterization)
                    name = `${homo.characterization.name}\n(${origin_risk_1.originRiskMap[homo.characterization.type].name})`;
            }
            const row = generateRow();
            const firstPosition = rowsPosition;
            if (showHomogeneous) {
                row[0] = {
                    text: name,
                    borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
                };
                if (showHomogeneousDescription)
                    row[1] = {
                        text: homo.description || ' ',
                        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
                    };
            }
            rows[rowsPosition] = row;
            const loop = (map) => {
                const hierarchyArray = Object.entries(map);
                let totalRowsToSpan = 0;
                hierarchyArray.forEach(([, hierarchyData]) => {
                    const firstPosition = rowsPosition;
                    const hierarchyColumnTypePosition = hierarchyColumns[hierarchyData.type];
                    const indexRowSpan = hierarchyColumnTypePosition;
                    if (!rows[rowsPosition])
                        rows[rowsPosition] = generateRow();
                    rows[rowsPosition][hierarchyColumnTypePosition] = {
                        text: hierarchyData.name,
                        employee: hierarchyData.numEmployees,
                        description: hierarchyData.description,
                        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
                    };
                    const childrenRowsToSpan = loop(hierarchyData.data);
                    if (indexRowSpan)
                        rows[firstPosition][indexRowSpan] = Object.assign(Object.assign({}, rows[firstPosition][indexRowSpan]), { rowSpan: childrenRowsToSpan });
                    totalRowsToSpan = childrenRowsToSpan + totalRowsToSpan;
                    rowsPosition++;
                });
                return totalRowsToSpan || 1;
            };
            const rowsToSpan = loop(firstHierarchyPlan);
            rows[firstPosition][0] = Object.assign(Object.assign({}, rows[firstPosition][0]), { rowSpan: rowsToSpan, shading: { fill: palette_1.palette.table.header.string } });
            rows[firstPosition][1] = Object.assign(Object.assign({}, rows[firstPosition][1]), { rowSpan: rowsToSpan });
            return row;
        });
        return rows.map((row) => row.filter((row) => row.text));
    }
    const bodyData = setBodyTable();
    bodyData.forEach((row) => {
        const employees = row[row.length - 1].employee;
        const description = row[row.length - 1].description;
        if (showDescription && hasAtLeastOneDescription)
            row[row.length] = {
                text: description,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
        row[row.length] = {
            text: employees,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
    });
    if (showDescription && hasAtLeastOneDescription)
        headerData[headerData.length] = {
            text: 'Descrição do cargo',
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            size: 5,
        };
    headerData[headerData.length] = {
        text: 'Nº',
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        size: 1,
    };
    return {
        bodyData,
        headerData,
    };
};
exports.hierarchyPlanConverter = hierarchyPlanConverter;
//# sourceMappingURL=hierarchyHomoOrg.converter.js.map