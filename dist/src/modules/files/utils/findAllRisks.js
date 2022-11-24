"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllRisks = void 0;
const findAllRisks = async (excelProvider, riskRepository, riskSheet, companyId) => {
    const riskData = await riskRepository.findAllByCompanyId(companyId, {
        include: { recMed: true, generateSource: true },
        where: { type: riskSheet.type, representAll: false },
    });
    const riskExcelRows = await excelProvider.transformToExcelData(riskData, riskSheet.columns);
    return {
        sheetName: riskSheet.name,
        rows: riskExcelRows,
        tableHeader: riskSheet.columns,
    };
};
exports.findAllRisks = findAllRisks;
//# sourceMappingURL=findAllRisks.js.map