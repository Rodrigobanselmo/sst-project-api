"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPRTableSection = void 0;
const docx_1 = require("docx");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const first_table_1 = require("./parts/first/first.table");
const second_table_1 = require("./parts/second/second.table");
const third_table_1 = require("./parts/third/third.table");
const APPRTableSection = (riskFactorGroupData, hierarchyData, homoGroupTree) => {
    const sectionsTables = [];
    const isByGroup = false;
    const map = new Map();
    Array.from(hierarchyData.values())
        .sort((a, b) => (0, string_sort_1.sortString)(a.org.map((o) => o.name).join(), b.org.map((o) => o.name).join()))
        .forEach((hierarchy) => {
        const createTable = () => {
            const firstTable = (0, first_table_1.firstRiskInventoryTableSection)(riskFactorGroupData, homoGroupTree, hierarchy, isByGroup);
            const secondTable = (0, second_table_1.secondRiskInventoryTableSection)(hierarchy, isByGroup);
            const thirdTable = (0, third_table_1.thirdRiskInventoryTableSection)(riskFactorGroupData, hierarchy, isByGroup);
            sectionsTables.push([firstTable, ...secondTable, ...thirdTable]);
        };
        const description = hierarchy.descReal;
        const homoGroupsIds = hierarchy.org.reduce((acc, hierarchy) => {
            if (hierarchy.homogeneousGroupIds)
                return [...acc, ...hierarchy.homogeneousGroupIds];
            return acc;
        }, []);
        homoGroupsIds.forEach((homoGroupID) => {
            if (map.get(homoGroupID)) {
                return;
            }
            const homoGroup = homoGroupTree[homoGroupID] || {
                description: '',
                type: null,
            };
            map.set(homoGroupID, true);
            if (!description && !homoGroup.type)
                hierarchy.descReal = homoGroup === null || homoGroup === void 0 ? void 0 : homoGroup.description;
            if (!homoGroup.type && isByGroup)
                hierarchy.descReal = (homoGroup === null || homoGroup === void 0 ? void 0 : homoGroup.description) || hierarchy.descReal || hierarchy.descRh;
            if (isByGroup)
                createTable();
        });
        if (isByGroup)
            return;
        createTable();
    });
    const setSection = (tables) => ({
        children: [...tables],
        properties: {
            page: {
                margin: { left: 500, right: 500, top: 500, bottom: 500 },
                size: { orientation: docx_1.PageOrientation.LANDSCAPE },
            },
        },
    });
    return sectionsTables.map((table) => setSection(table));
};
exports.APPRTableSection = APPRTableSection;
//# sourceMappingURL=appr.section.js.map