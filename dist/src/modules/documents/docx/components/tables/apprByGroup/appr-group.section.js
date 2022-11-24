"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPRByGroupTableSection = void 0;
const client_1 = require("@prisma/client");
const docx_1 = require("docx");
const removeDuplicate_1 = require("../../../../../../shared/utils/removeDuplicate");
const origin_risk_1 = require("../../../../../../shared/constants/maps/origin-risk");
const first_table_1 = require("./parts/first/first.table");
const second_table_1 = require("./parts/second/second.table");
const third_table_1 = require("./parts/third/third.table");
const offices_table_1 = require("./parts/2-offices/offices.table");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const APPRByGroupTableSection = (riskFactorGroupData, hierarchyData, hierarchyTree, homoGroupTree, options = {
    isByGroup: true,
}) => {
    const sectionsTables = [];
    const isByGroup = options.isByGroup;
    let workspace = '';
    hierarchyData.forEach((hierarchy) => {
        if (workspace)
            return;
        if (hierarchy.workspace)
            workspace = hierarchy.workspace;
    });
    const hierarchyDataHomoGroup = new Map();
    const everyHomoFound = [];
    const everyHomoNotFound = [];
    const setHomoGroup = (homo) => {
        let nameOrigin;
        let desc;
        let descRh;
        let typeOrigin;
        if (homo.environment) {
            typeOrigin = 'GSE Desenvolvido (Ambiente)';
            desc = homo.environment.description;
            nameOrigin = `${homo.environment.name} (${origin_risk_1.originRiskMap[homo.environment.type].name})`;
        }
        if (homo.characterization) {
            typeOrigin = `GSE Desenvolvido (${origin_risk_1.originRiskMap[homo.characterization.type].name})`;
            desc = homo.characterization.description;
            nameOrigin = `${homo.characterization.name} `;
        }
        if (homo.type == client_1.HomoTypeEnum.HIERARCHY) {
            const hierarchy = hierarchyTree[homo.id] || hierarchyTree[homo.name];
            if (hierarchy) {
                typeOrigin = `GSE Desenvolvido (${origin_risk_1.originRiskMap[hierarchy.type].name})`;
                nameOrigin = `${hierarchy.name}`;
                desc = hierarchy.realDescription;
                descRh = hierarchy.description;
            }
        }
        if (!homo.type) {
            typeOrigin = 'GSE';
            desc = homo.description;
            nameOrigin = homo.name;
        }
        hierarchyDataHomoGroup.set(homo.id, {
            hierarchies: homoGroupTree[homo.id].hierarchies,
            allHomogeneousGroupIds: [homo.id],
            descReal: desc,
            descRh: descRh || desc,
            employeesLength: homo.employeeCount,
            org: [
                {
                    id: homo.id,
                    name: nameOrigin,
                    homogeneousGroup: nameOrigin,
                    environments: '',
                    homogeneousGroupIds: [homo.id],
                    type: '',
                    typeEnum: homo.type === client_1.HomoTypeEnum.HIERARCHY ? hierarchyTree[homo.name].type : '',
                },
            ],
            workspace,
            type: typeOrigin,
        });
    };
    Object.values(homoGroupTree)
        .sort((a, b) => (0, string_sort_1.sortString)(a.name, b.name))
        .forEach((homo) => {
        if (homo.type)
            return;
        const foundHomo = hierarchyDataHomoGroup.get(homo.id);
        if (!foundHomo)
            setHomoGroup(homo);
        everyHomoFound.push(homo.id);
        homoGroupTree[homo.id].hierarchies.forEach((hierarchy, i, hierarchies) => {
            var _a;
            const allHomogeneousGroupIds = (_a = (hierarchyData.get(hierarchy.id) || { allHomogeneousGroupIds: [] })) === null || _a === void 0 ? void 0 : _a.allHomogeneousGroupIds;
            (0, removeDuplicate_1.removeDuplicate)([...allHomogeneousGroupIds.map((id) => ({ id })), ...hierarchy.homogeneousGroups], { removeById: 'id' }).forEach((homoGroup) => {
                const isOnEvery = hierarchies.every((hierarchyEvery) => {
                    var _a;
                    const everyAllHomogeneousGroupIds = (_a = (hierarchyData.get(hierarchyEvery.id) || {
                        allHomogeneousGroupIds: [],
                    })) === null || _a === void 0 ? void 0 : _a.allHomogeneousGroupIds;
                    return [...everyAllHomogeneousGroupIds.map((id) => ({ id })), ...hierarchyEvery.homogeneousGroups].find((h) => h.id === homoGroup.id);
                });
                const mapDataHomo = hierarchyDataHomoGroup.get(homo.id);
                const isHomoAdded = mapDataHomo.allHomogeneousGroupIds.find((homoId) => homoId === homoGroup.id);
                if (isOnEvery && !isHomoAdded) {
                    everyHomoFound.push(homoGroup.id);
                    const allHomogeneousGroupIds = [...mapDataHomo.allHomogeneousGroupIds, homoGroup.id];
                    hierarchyDataHomoGroup.set(homo.id, Object.assign(Object.assign({}, mapDataHomo), { allHomogeneousGroupIds, hierarchies: homoGroupTree[homo.id].hierarchies }));
                }
                if (!isOnEvery) {
                    everyHomoNotFound.push(homoGroup.id);
                }
            });
        });
    });
    Object.values(homoGroupTree).forEach((homo) => {
        const hasFound = everyHomoFound.includes(homo.id);
        if (!hasFound) {
            setHomoGroup(homo);
        }
    });
    hierarchyDataHomoGroup.forEach((hierarchy) => {
        const createTable = () => {
            const firstTable = (0, first_table_1.firstRiskInventoryTableSection)(riskFactorGroupData, homoGroupTree, hierarchy, isByGroup);
            const officeTable = (0, offices_table_1.officeRiskInventoryTableSection)(hierarchy);
            const secondTable = (0, second_table_1.secondRiskInventoryTableSection)(hierarchy, isByGroup);
            const thirdTable = (0, third_table_1.thirdRiskInventoryTableSection)(riskFactorGroupData, hierarchy, hierarchyTree);
            sectionsTables.push([firstTable, ...officeTable, ...secondTable, ...thirdTable]);
        };
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
exports.APPRByGroupTableSection = APPRByGroupTableSection;
//# sourceMappingURL=appr-group.section.js.map