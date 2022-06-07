"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllHierarchies = void 0;
const findAllHierarchies = async (excelProvider, hierarchyRepository, riskSheet, companyId) => {
    const excelRows = await excelProvider.transformToExcelData([], riskSheet.columns);
    return {
        sheetName: riskSheet.name,
        rows: excelRows,
        tableHeader: riskSheet.columns,
    };
};
exports.findAllHierarchies = findAllHierarchies;
//# sourceMappingURL=findAllHierarchies.js.map