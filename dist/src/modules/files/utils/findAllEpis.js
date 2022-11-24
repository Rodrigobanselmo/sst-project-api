"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllEpis = void 0;
const findAllEpis = async (excelProvider, epiRepository, riskSheet) => {
    const data = await epiRepository.findAll();
    const epiExcelRows = await excelProvider.transformToExcelData(data, riskSheet.columns);
    return {
        sheetName: riskSheet.name,
        rows: epiExcelRows,
        tableHeader: riskSheet.columns,
    };
};
exports.findAllEpis = findAllEpis;
//# sourceMappingURL=findAllEpis.js.map