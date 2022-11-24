"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllEmployees = void 0;
const client_1 = require("@prisma/client");
const hierarchy_list_1 = require("../../../shared/constants/lists/hierarchy.list");
const getPathIdTreeMap_1 = require("../../../shared/utils/getPathIdTreeMap");
const statusEnum_translate_1 = require("../../../shared/utils/translate/statusEnum.translate");
const HierarchyExcelProvider_1 = require("../providers/HierarchyExcelProvider");
const findAllEmployees = async (excelProvider, companyRepository, workspaceRepository, hierarchyRepository, riskSheet, companyId) => {
    var _a;
    const hierarchyExcel = new HierarchyExcelProvider_1.HierarchyExcelProvider();
    const company = await companyRepository.findById(companyId, {
        include: { employees: { orderBy: { name: 'asc' } }, workspace: true },
    });
    if (((_a = company.workspace) === null || _a === void 0 ? void 0 : _a.length) === 1)
        riskSheet.columns = riskSheet.columns.filter((column) => column.databaseName !== 'abbreviation');
    const hierarchies = await hierarchyRepository.findAllHierarchyByCompany(companyId, {
        include: {
            hierarchyOnHomogeneous: {
                include: {
                    homogeneousGroup: {
                        include: { characterization: true, environment: true },
                    },
                },
            },
            workspaces: true,
        },
    });
    const hierarchyTree = hierarchyExcel.transformArrayToHierarchyMapTree(hierarchies);
    company.employees = company.employees
        .map((employee) => {
        const hierarchyId = employee.hierarchyId;
        if (hierarchyId) {
            const pathIds = (0, getPathIdTreeMap_1.getPathIdTreeMap)(hierarchyId, hierarchyTree);
            const pathsHierarchy = pathIds.map((id) => hierarchyTree[id]);
            const newEmployee = Object.assign({}, employee);
            newEmployee.status = (0, statusEnum_translate_1.statusEnumTranslateUsToBr)(newEmployee.status);
            hierarchy_list_1.hierarchyList.forEach((type) => {
                const hierarchy = pathsHierarchy.find((h) => h.type === type);
                if (hierarchy) {
                    newEmployee[type.toLocaleLowerCase()] = hierarchy.name;
                    if (hierarchy.homogeneousGroups) {
                        const foundHomo = hierarchy.homogeneousGroups.reverse().filter((hierarchy) => !hierarchy.type);
                        newEmployee.ghoName = foundHomo.map((h) => (h === null || h === void 0 ? void 0 : h.name) || '');
                        newEmployee.ghoDescription = foundHomo.map((h) => (h === null || h === void 0 ? void 0 : h.description) || '');
                    }
                    if ([client_1.HierarchyEnum.OFFICE].includes(type.toUpperCase())) {
                        newEmployee.description = (hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.description) || '';
                        newEmployee.realDescription = (hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy.realDescription) || '';
                    }
                }
            });
            return newEmployee;
        }
        return employee;
    })
        .reduce((acc, curr) => {
        const actual = [...acc];
        if (curr.ghoName && curr.ghoName.length > 0) {
            curr.ghoName.forEach((h, index) => {
                var _a;
                const currCopy = Object.assign({}, curr);
                currCopy.ghoName = h;
                currCopy.ghoDescription = ((_a = curr[index]) === null || _a === void 0 ? void 0 : _a.ghoDescription) || '';
                actual.push(currCopy);
            });
        }
        else {
            actual.push(curr);
        }
        return actual;
    }, []);
    const workspaces = company.workspace;
    company.employees = company.employees.map((employee) => {
        var _a;
        const hierarchyWorkspace = (_a = hierarchies.find((hierarchy) => hierarchy.id === employee.hierarchyId)) === null || _a === void 0 ? void 0 : _a.workspaceIds;
        const workspace = workspaces.find((workspace) => hierarchyWorkspace && hierarchyWorkspace.find((id) => id == workspace.id));
        return Object.assign(Object.assign({}, employee), { abbreviation: workspace === null || workspace === void 0 ? void 0 : workspace.abbreviation });
    });
    const excelRows = await excelProvider.transformToExcelData(company.employees, riskSheet.columns);
    return {
        sheetName: riskSheet.name,
        rows: excelRows,
        tableHeader: riskSheet.columns,
    };
};
exports.findAllEmployees = findAllEmployees;
//# sourceMappingURL=findAllEmployees.js.map