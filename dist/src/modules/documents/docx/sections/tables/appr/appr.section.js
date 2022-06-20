"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPRTableSection = void 0;
const client_1 = require("@prisma/client");
const docx_1 = require("docx");
const first_table_1 = require("./parts/first/first.table");
const second_table_1 = require("./parts/second/second.table");
const third_table_1 = require("./parts/third/third.table");
const APPRTableSection = (riskFactorGroupData, hierarchyData, homoGroupTree, options = {
    hierarchyType: client_1.HierarchyEnum.SECTOR,
    isByGroup: true,
}) => {
    const sectionsTables = [];
    const isByGroup = options.isByGroup;
    const map = new Map();
    hierarchyData.forEach((hierarchy) => {
        const createTable = () => {
            const firstTable = (0, first_table_1.firstRiskInventoryTableSection)(riskFactorGroupData, hierarchy, isByGroup);
            const secondTable = (0, second_table_1.secondRiskInventoryTableSection)(hierarchy, isByGroup);
            const thirdTable = (0, third_table_1.thirdRiskInventoryTableSection)(riskFactorGroupData, hierarchy);
            sectionsTables.push([firstTable, ...secondTable, ...thirdTable]);
        };
        if (isByGroup) {
            const homoGroupsIds = hierarchy.org.reduce((acc, hierarchy) => {
                if (hierarchy.homogeneousGroupIds)
                    return [...acc, ...hierarchy.homogeneousGroupIds];
            }, []);
            homoGroupsIds.forEach((homoGroupID) => {
                if (map.get(homoGroupID)) {
                    return;
                }
                const homoGroup = homoGroupTree[homoGroupID] || { description: '' };
                map.set(homoGroupID, true);
                hierarchy.descReal =
                    (homoGroup === null || homoGroup === void 0 ? void 0 : homoGroup.description) || hierarchy.descReal || hierarchy.descRh;
                createTable();
            });
            return;
        }
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