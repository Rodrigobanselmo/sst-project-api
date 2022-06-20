"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllEmployees = void 0;
const client_1 = require("@prisma/client");
const getPathIdTreeMap_1 = require("../../../shared/utils/getPathIdTreeMap");
const statusEnum_translate_1 = require("../../../shared/utils/translate/statusEnum.translate");
const HierarchyExcelProvider_1 = require("../providers/HierarchyExcelProvider");
const findAllEmployees = async (excelProvider, companyRepository, workspaceRepository, hierarchyRepository, riskSheet, companyId) => {
    const hierarchyExcel = new HierarchyExcelProvider_1.HierarchyExcelProvider();
    const company = await companyRepository.findById(companyId, {
        include: { employees: true },
    });
    const hierarchies = await hierarchyRepository.findAllHierarchyByCompany(companyId);
    const hierarchyTree = hierarchyExcel.transformArrayToHierarchyMapTree(hierarchies);
    company.employees = company.employees.map((employee) => {
        const hierarchyId = employee.hierarchyId;
        if (hierarchyId) {
            const pathIds = (0, getPathIdTreeMap_1.getPathIdTreeMap)(hierarchyId, hierarchyTree);
            const pathsHierarchy = pathIds.map((id) => hierarchyTree[id]);
            const newEmployee = Object.assign({}, employee);
            newEmployee.status = (0, statusEnum_translate_1.statusEnumTranslateUsToBr)(newEmployee.status);
            Object.values(client_1.HierarchyEnum).forEach((type) => {
                const hierarchy = pathsHierarchy.find((h) => h.type === type);
                if (hierarchy) {
                    newEmployee[type.toLocaleLowerCase()] = hierarchy.name;
                }
            });
            return newEmployee;
        }
        return employee;
    });
    const workspaces = await workspaceRepository.findByCompany(companyId);
    company.employees = company.employees.map((employee) => {
        const workspace = workspaces.find((workspace) => employee.workspaces &&
            employee.workspaces.find((w) => w.id == workspace.id));
        return Object.assign(Object.assign({}, employee), { abbreviation: workspace.abbreviation });
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