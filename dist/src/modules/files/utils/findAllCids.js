"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCids = void 0;
const findAllCids = async (excelProvider, cidRepository, riskSheet) => {
    const data = await cidRepository.findNude();
    const cidExcelRows = await excelProvider.transformToExcelData(data, riskSheet.columns);
    return {
        sheetName: riskSheet.name,
        rows: cidExcelRows,
        tableHeader: riskSheet.columns,
    };
};
exports.findAllCids = findAllCids;
//# sourceMappingURL=findAllCids.js.map