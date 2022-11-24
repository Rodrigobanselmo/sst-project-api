"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCnaes = void 0;
const findAllCnaes = async (excelProvider, activityRepository, riskSheet) => {
    const data = await activityRepository.findAll();
    const cnaeExcelRows = await excelProvider.transformToExcelData(data, riskSheet.columns);
    return {
        sheetName: riskSheet.name,
        rows: cnaeExcelRows,
        tableHeader: riskSheet.columns,
    };
};
exports.findAllCnaes = findAllCnaes;
//# sourceMappingURL=findAllCnae.js.map