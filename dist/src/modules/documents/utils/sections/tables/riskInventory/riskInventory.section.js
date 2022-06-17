"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskInventoryTableSection = void 0;
const docx_1 = require("docx");
const first_table_1 = require("./parts/first/first.table");
const second_table_1 = require("./parts/second/second.table");
const third_table_1 = require("./parts/third/third.table");
const riskInventoryTableSection = (riskFactorGroupData, hierarchyData) => {
    const sectionsTables = [];
    const map = new Map();
    hierarchyData.forEach((hierarchy) => {
        const homoGroupsIds = hierarchy.org.reduce((acc, hierarchy) => {
            if (hierarchy.homogeneousGroupIds)
                return [...acc, ...hierarchy.homogeneousGroupIds];
        }, []);
        homoGroupsIds.forEach((homoGroupID) => {
            if (map.get(homoGroupID)) {
                return;
            }
            map.set(homoGroupID, true);
            const firstTable = (0, first_table_1.firstRiskInventoryTableSection)(riskFactorGroupData, hierarchy);
            const secondTable = (0, second_table_1.secondRiskInventoryTableSection)(hierarchy);
            const thirdTable = (0, third_table_1.thirdRiskInventoryTableSection)(riskFactorGroupData, hierarchy);
            sectionsTables.push([firstTable, ...secondTable, ...thirdTable]);
        });
        return;
        const firstTable = (0, first_table_1.firstRiskInventoryTableSection)(riskFactorGroupData, hierarchy);
        const secondTable = (0, second_table_1.secondRiskInventoryTableSection)(hierarchy);
        const thirdTable = (0, third_table_1.thirdRiskInventoryTableSection)(riskFactorGroupData, hierarchy);
        sectionsTables.push([firstTable, ...secondTable, ...thirdTable]);
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
exports.riskInventoryTableSection = riskInventoryTableSection;
//# sourceMappingURL=riskInventory.section.js.map